/**
 * useRmbgWorker.js
 * Custom hook that manages the RMBG Web Worker lifecycle.
 * Exposes model status, progress, and a `removeBackground` function.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import RmbgWorker from '../worker/rmbg.worker.js?worker'

/**
 * Bilinear interpolation sample from a grayscale mask.
 * Gives smooth sub-pixel alpha values when upscaling the mask
 * to the full original image resolution.
 */
function sampleMaskBilinear(mask, u, v) {
  // u, v are floating-point coordinates in mask space
  const x0 = Math.floor(u)
  const y0 = Math.floor(v)
  const x1 = Math.min(x0 + 1, mask.width - 1)
  const y1 = Math.min(y0 + 1, mask.height - 1)

  const fx = u - x0
  const fy = v - y0

  const w = mask.width
  const m = mask.data

  const tl = m[y0 * w + x0]
  const tr = m[y0 * w + x1]
  const bl = m[y1 * w + x0]
  const br = m[y1 * w + x1]

  // Bilinear blend
  return (
    tl * (1 - fx) * (1 - fy) +
    tr * fx       * (1 - fy) +
    bl * (1 - fx) * fy       +
    br * fx       * fy
  )
}

/**
 * Smooth a raw alpha value with a soft threshold curve.
 * Pushes mid-range values toward 0 or 255, softening hard edges
 * while preserving genuine transparency at the boundary.
 */
function refineAlpha(raw) {
  // Normalize to 0–1
  const a = raw / 255
  // Smooth-step: sharpens edges but keeps anti-aliasing
  const smoothed = a * a * (3 - 2 * a)
  return Math.round(smoothed * 255)
}

/**
 * Apply the segmentation mask to the original full-resolution image.
 * Uses bilinear interpolation + alpha refinement for crisp, high-quality edges.
 * Returns a blob URL of the resulting transparent PNG.
 */
function applyMaskToImage(originalDataUrl, mask) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const W = img.naturalWidth
      const H = img.naturalHeight

      const canvas = document.createElement('canvas')
      canvas.width  = W
      canvas.height = H

      const ctx = canvas.getContext('2d')
      // Draw original at full resolution
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, W, H)
      const pixels    = imageData.data

      // Scale factors: map image pixel → mask coordinate
      const scaleX = (mask.width  - 1) / (W - 1 || 1)
      const scaleY = (mask.height - 1) / (H - 1 || 1)

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const pixelIdx = (y * W + x) * 4

          // Map to fractional mask coordinates
          const mu = x * scaleX
          const mv = y * scaleY

          // High-quality bilinear sample
          const raw = sampleMaskBilinear(mask, mu, mv)

          // Apply smooth-step refinement for cleaner edges
          pixels[pixelIdx + 3] = refineAlpha(raw)
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Export at maximum quality PNG (lossless, full resolution)
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(URL.createObjectURL(blob))
          else reject(new Error('Canvas toBlob returned null'))
        },
        'image/png'
      )
    }

    img.onerror = () => reject(new Error('Failed to load image for masking'))
    img.src = originalDataUrl
  })
}

// ── Model states ──────────────────────────────────────────────────────────────
export const MODEL_STATE = {
  IDLE:       'idle',
  LOADING:    'loading',
  READY:      'ready',
  ERROR:      'error',
  PROCESSING: 'processing',
}

export default function useRmbgWorker() {
  const workerRef = useRef(null)

  const [modelState,    setModelState]    = useState(MODEL_STATE.IDLE)
  const [modelProgress, setModelProgress] = useState(0)
  const [modelDevice,   setModelDevice]   = useState(null)   // 'webgpu' | 'wasm'
  const [modelError,    setModelError]    = useState(null)

  // Hold the current dataUrl and callbacks for the in-flight inference request
  const inflightRef = useRef({ dataUrl: null, resolve: null, reject: null })

  // ── Boot worker ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const worker = new RmbgWorker()
    workerRef.current = worker

    worker.onmessage = async ({ data }) => {
      switch (data.type) {
        case 'progress':
          setModelProgress(data.pct)
          break

        case 'ready':
          setModelState(MODEL_STATE.READY)
          setModelProgress(100)
          setModelDevice(data.device)
          break

        case 'result': {
          const { resolve, dataUrl } = inflightRef.current
          inflightRef.current = { dataUrl: null, resolve: null, reject: null }
          if (resolve && dataUrl) {
            try {
              const resultUrl = await applyMaskToImage(dataUrl, data.mask)
              resolve(resultUrl)
            } catch (e) {
              const { reject: rej } = inflightRef.current
              if (rej) rej(e)
            }
          }
          setModelState(MODEL_STATE.READY)
          break
        }

        case 'error':
          if (data.fatal) {
            setModelState(MODEL_STATE.ERROR)
            setModelError(data.message)
          } else {
            const { reject: rej } = inflightRef.current
            inflightRef.current = { dataUrl: null, resolve: null, reject: null }
            if (rej) rej(new Error(data.message))
            setModelState(MODEL_STATE.READY)
          }
          break

        default:
          break
      }
    }

    worker.onerror = (e) => {
      setModelState(MODEL_STATE.ERROR)
      setModelError(e.message)
    }

    setModelState(MODEL_STATE.LOADING)
    worker.postMessage({ type: 'load' })

    return () => {
      worker.terminate()
      workerRef.current = null
    }
  }, [])

  // ── removeBackground ────────────────────────────────────────────────────────
  const removeBackground = useCallback((imageDataUrl) => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || modelState !== MODEL_STATE.READY) {
        reject(new Error('Worker not ready'))
        return
      }

      inflightRef.current = { dataUrl: imageDataUrl, resolve, reject }
      setModelState(MODEL_STATE.PROCESSING)
      workerRef.current.postMessage({ type: 'run', imageDataUrl })
    })
  }, [modelState])

  return {
    modelState,
    modelProgress,
    modelDevice,
    modelError,
    removeBackground,
    isReady:      modelState === MODEL_STATE.READY,
    isLoading:    modelState === MODEL_STATE.LOADING,
    isProcessing: modelState === MODEL_STATE.PROCESSING,
    hasError:     modelState === MODEL_STATE.ERROR,
  }
}