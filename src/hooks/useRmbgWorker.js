/**
 * useRmbgWorker.js
 * Custom hook that manages the RMBG Web Worker lifecycle.
 * Exposes model status, progress, and a `removeBackground` function.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import RmbgWorker from '../worker/rmbg.worker.js?worker'

/**
 * Apply the segmentation mask to the original image on a canvas.
 * Returns a blob URL of the resulting transparent PNG.
 */
function applyMaskToImage(originalDataUrl, mask) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width  = img.naturalWidth
      canvas.height = img.naturalHeight

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels    = imageData.data

      // The mask may have different dimensions — scale if needed
      const scaleX = mask.width  / canvas.width
      const scaleY = mask.height / canvas.height

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const pixelIdx = (y * canvas.width + x) * 4

          // Sample corresponding mask pixel
          const mx = Math.round(x * scaleX)
          const my = Math.round(y * scaleY)
          const maskIdx = my * mask.width + mx

          pixels[pixelIdx + 3] = mask.data[maskIdx]
        }
      }

      ctx.putImageData(imageData, 0, 0)

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
