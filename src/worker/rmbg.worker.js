import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3/dist/transformers.min.js'

env.allowLocalModels = false
const MODEL = 'briaai/RMBG-1.4'
let seg = null

function prog(p) {
  if (p.status === 'initiate') self.postMessage({ type: 'progress', pct: 0 })
  if (p.status === 'progress') self.postMessage({ type: 'progress', pct: Math.round(p.progress ?? 0) })
  if (p.status === 'done')     self.postMessage({ type: 'progress', pct: 100 })
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
 * Apply mask entirely in worker using OffscreenCanvas.
 * Bilinear interpolation + smooth-step alpha — high quality edges.
 * Zero main thread involvement.
 */
async function applyMask(imageBuf, imageType, mask) {
  const blob = new Blob([imageBuf], { type: imageType })
  const bmp  = await createImageBitmap(blob)
  const W = bmp.width, H = bmp.height

  const canvas = new OffscreenCanvas(W, H)
  const ctx    = canvas.getContext('2d')
  ctx.drawImage(bmp, 0, 0)
  bmp.close()

  const id = ctx.getImageData(0, 0, W, H)
  const px = id.data
  const mw = mask.width
  const md = mask.data
  const sx = (mw - 1) / Math.max(W - 1, 1)
  const sy = (mask.height - 1) / Math.max(H - 1, 1)

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const mu = x * sx, mv = y * sy
      const x0 = mu | 0, y0 = mv | 0
      const x1 = Math.min(x0 + 1, mw - 1)
      const y1 = Math.min(y0 + 1, mask.height - 1)
      const fx = mu - x0, fy = mv - y0
      const raw =
        md[y0*mw+x0]*(1-fx)*(1-fy) + md[y0*mw+x1]*fx*(1-fy) +
        md[y1*mw+x0]*(1-fx)*fy     + md[y1*mw+x1]*fx*fy
      const a = raw / 255
      px[(y*W+x)*4+3] = (a*a*(3-2*a)*255+0.5)|0
    }
  }

  ctx.putImageData(id, 0, 0)
  const outBlob = await canvas.convertToBlob({ type: 'image/png' })
  return outBlob.arrayBuffer()
}

async function run(imageBuf, imageType) {
  if (!seg) {
    self.postMessage({ type: 'error', message: 'Model not ready', fatal: false })
    return
  }
  try {
    // Create a blob URL inside the worker for the segmenter
    const blob    = new Blob([imageBuf], { type: imageType })
    const blobUrl = URL.createObjectURL(blob)

    const out  = await seg(blobUrl)
    URL.revokeObjectURL(blobUrl)

    const mask   = out[0].mask
    const pngBuf = await applyMask(imageBuf, imageType, mask)

    self.postMessage({ type: 'result', pngBuf }, [pngBuf])
  } catch (e) {
    self.postMessage({ type: 'error', message: e.message, fatal: false })
  }
}

self.onmessage = ({ data }) => {
  if (data.type === 'load') load()
  if (data.type === 'run')  run(data.imageBuf, data.imageType)
}
