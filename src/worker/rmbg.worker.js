/**
 * rmbg.worker.js
 * Runs the RMBG-1.4 segmentation model entirely in a Web Worker.
 * Uses WebGPU when available, falls back to WebAssembly (WASM).
 *
 * Messages IN:
 *   { type: 'load' }
 *   { type: 'run', imageDataUrl: string }
 *
 * Messages OUT:
 *   { type: 'progress', phase: 'downloading'|'building', pct: number }
 *   { type: 'ready', device: 'webgpu'|'wasm' }
 *   { type: 'result', mask: { data: Uint8ClampedArray, width: number, height: number } }
 *   { type: 'error', message: string, fatal: boolean }
 */

// Uses CDN so the large onnxruntime-node package is not needed as an npm dep.
// To use the npm package instead: npm install @huggingface/transformers
// then change this line to: import { pipeline, env } from '@huggingface/transformers'
/* global importScripts */
import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js'

// Only use remote models — no local cache attempts
env.allowLocalModels = false

const MODEL_ID = 'briaai/RMBG-1.4'

let segmenter = null
let activeDevice = null

// ── Progress callback ─────────────────────────────────────────────────────────
function onProgress(p) {
  if (p.status === 'progress') {
    self.postMessage({
      type: 'progress',
      phase: 'downloading',
      pct: Math.round(p.progress ?? 0),
      file: p.file ?? '',
    })
  } else if (p.status === 'initiate') {
    self.postMessage({ type: 'progress', phase: 'downloading', pct: 0, file: p.file ?? '' })
  } else if (p.status === 'done') {
    self.postMessage({ type: 'progress', phase: 'building', pct: 100, file: p.file ?? '' })
  }
}

// ── Load model ────────────────────────────────────────────────────────────────
async function loadModel() {
  const shared = { progress_callback: onProgress }

  // Try WebGPU first (fastest)
  try {
    segmenter = await pipeline('image-segmentation', MODEL_ID, {
      ...shared,
      device: 'webgpu',
      dtype: 'fp16',
    })
    activeDevice = 'webgpu'
    self.postMessage({ type: 'ready', device: 'webgpu' })
    return
  } catch (gpuErr) {
    console.warn('[worker] WebGPU unavailable, falling back to WASM:', gpuErr.message)
  }

  // Fallback: WASM / CPU
  try {
    segmenter = await pipeline('image-segmentation', MODEL_ID, {
      ...shared,
      device: 'wasm',
      dtype: 'fp32',
    })
    activeDevice = 'wasm'
    self.postMessage({ type: 'ready', device: 'wasm' })
  } catch (wasmErr) {
    self.postMessage({ type: 'error', message: wasmErr.message, fatal: true })
  }
}

// ── Run inference ─────────────────────────────────────────────────────────────
async function runInference(imageDataUrl) {
  if (!segmenter) {
    self.postMessage({ type: 'error', message: 'Model not loaded', fatal: false })
    return
  }

  try {
    const output = await segmenter(imageDataUrl)
    // output[0].mask is a { data: Uint8ClampedArray, width, height } object
    const mask = output[0].mask
    self.postMessage(
      { type: 'result', mask: { data: mask.data, width: mask.width, height: mask.height } },
      [mask.data.buffer]   // transfer instead of copy
    )
  } catch (err) {
    self.postMessage({ type: 'error', message: err.message, fatal: false })
  }
}

// ── Message router ────────────────────────────────────────────────────────────
self.onmessage = ({ data }) => {
  if (data.type === 'load') loadModel()
  if (data.type === 'run')  runInference(data.imageDataUrl)
}
