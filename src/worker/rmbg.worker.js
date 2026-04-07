import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js'

env.allowLocalModels = false
const MODEL = 'briaai/RMBG-1.4'
let seg = null

function prog(p) {
  if (p.status === 'initiate') self.postMessage({ type: 'progress', pct: 0, file: p.file ?? '' })
  if (p.status === 'progress') self.postMessage({ type: 'progress', pct: Math.round(p.progress ?? 0), file: p.file ?? '' })
  if (p.status === 'done')     self.postMessage({ type: 'progress', pct: 100, file: p.file ?? '' })
}

async function load() {
  const opts = { progress_callback: prog }
  try {
    seg = await pipeline('image-segmentation', MODEL, { ...opts, device: 'webgpu', dtype: 'fp16' })
    self.postMessage({ type: 'ready', device: 'webgpu' })
  } catch {
    try {
      seg = await pipeline('image-segmentation', MODEL, { ...opts, device: 'wasm', dtype: 'fp32' })
      self.postMessage({ type: 'ready', device: 'wasm' })
    } catch (e) {
      self.postMessage({ type: 'error', message: e.message, fatal: true })
    }
  }
}

async function run(imageDataUrl) {
  if (!seg) { self.postMessage({ type: 'error', message: 'Model not ready', fatal: false }); return }
  try {
    const out  = await seg(imageDataUrl)
    const mask = out[0].mask
    self.postMessage({ type: 'result', mask: { data: mask.data, width: mask.width, height: mask.height } }, [mask.data.buffer])
  } catch (e) {
    self.postMessage({ type: 'error', message: e.message, fatal: false })
  }
}

self.onmessage = ({ data }) => {
  if (data.type === 'load') load()
  if (data.type === 'run')  run(data.imageDataUrl)
}
