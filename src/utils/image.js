export const fileToDataUrl = (file) => new Promise((res, rej) => {
  const r = new FileReader()
  r.onload  = e => res(e.target.result)
  r.onerror = () => rej(new Error('Failed to read file'))
  r.readAsDataURL(file)
})

export const formatSize = (bytes) => {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export const isImage = (file) =>
  file && ['image/png','image/jpeg','image/webp','image/gif'].includes(file.type)

export const download = (url, name = 'zerobg-result.png') => {
  const a = document.createElement('a')
  a.href = url; a.download = name
  document.body.appendChild(a); a.click(); document.body.removeChild(a)
}

export function applyMask(originalDataUrl, mask) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const W = img.naturalWidth, H = img.naturalHeight
      const canvas = document.createElement('canvas')
      canvas.width = W; canvas.height = H
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0)
      const id = ctx.getImageData(0, 0, W, H)
      const px = id.data
      const sx = (mask.width  - 1) / Math.max(W - 1, 1)
      const sy = (mask.height - 1) / Math.max(H - 1, 1)

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          const mu = x * sx, mv = y * sy
          const x0 = Math.floor(mu), y0 = Math.floor(mv)
          const x1 = Math.min(x0 + 1, mask.width  - 1)
          const y1 = Math.min(y0 + 1, mask.height - 1)
          const fx = mu - x0, fy = mv - y0
          const w  = mask.width, m = mask.data
          const raw =
            m[y0*w+x0]*(1-fx)*(1-fy) + m[y0*w+x1]*fx*(1-fy) +
            m[y1*w+x0]*(1-fx)*fy     + m[y1*w+x1]*fx*fy
          const a = raw / 255
          px[(y*W+x)*4+3] = Math.round(a*a*(3-2*a)*255)
        }
      }
      ctx.putImageData(id, 0, 0)
      canvas.toBlob(b => b ? resolve(URL.createObjectURL(b)) : reject(new Error('toBlob failed')), 'image/png')
    }
    img.onerror = () => reject(new Error('Image load failed'))
    img.src = originalDataUrl
  })
}
