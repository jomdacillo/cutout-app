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

/**
 * Apply segmentation mask to the original image entirely inside the worker.
 * This keeps the heavy pixel loop OFF the main thread — critical for mobile.
 * Uses bilinear interpolation + smooth-step alpha for high quality edges.
 */
async function applyMaskInWorker(imageDataUrl, mask) {
  // Decode the image via OffscreenCanvas (supported in all modern workers)
  const res  = await fetch(imageDataUrl)
  const blob = await res.blob()
  const bmp  = await createImageBitmap(blob)

  const W = bmp.width
  const H = bmp.height

  const canvas = new OffscreenCanvas(W, H)
  const ctx    = canvas.getContext('2d')
  ctx.drawImage(bmp, 0, 0)
  bmp.close()

  const id = ctx.getImageData(0, 0, W, H)
  const px = id.data

  const sx = (mask.width  - 1) / Math.max(W - 1, 1)
  const sy = (mask.height - 1) / Math.max(H - 1, 1)
  const mw = mask.width
  const md = mask.data

  // Bilinear interpolation + smooth-step — runs in worker thread, not main
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const mu = x * sx, mv = y * sy
      const x0 = mu | 0,  y0 = mv | 0
      const x1 = Math.min(x0 + 1, mw - 1)
      const y1 = Math.min(y0 + 1, mask.height - 1)
      const fx = mu - x0,  fy = mv - y0
      const raw =
        md[y0*mw+x0]*(1-fx)*(1-fy) + md[y0*mw+x1]*fx*(1-fy) +
        md[y1*mw+x0]*(1-fx)*fy     + md[y1*mw+x1]*fx*fy
      const a = raw / 255
      px[(y*W+x)*4+3] = (a*a*(3-2*a)*255+0.5) | 0
    }
  }

  ctx.putImageData(id, 0, 0)

  // Return as blob transferred back to main thread
  const outBlob = await canvas.convertToBlob({ type: 'image/png' })
  const arrBuf  = await outBlob.arrayBuffer()
  return arrBuf
}

async function run(imageDataUrl) {
  if (!seg) { self.postMessage({ type: 'error', message: 'Model not ready', fatal: false }); return }
  try {
    const out  = await seg(imageDataUrl)
    const mask = out[0].mask

    // Apply mask inside worker — keeps main thread free on mobile
    const pngBuf = await applyMaskInWorker(imageDataUrl, mask)
    self.postMessage({ type: 'result', pngBuf }, [pngBuf])
  } catch (e) {
    self.postMessage({ type: 'error', message: e.message, fatal: false })
  }
}

self.onmessage = ({ data }) => {
  if (data.type === 'load') load()
  if (data.type === 'run')  run(data.imageDataUrl)
}

