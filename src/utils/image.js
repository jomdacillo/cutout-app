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

/**
 * fileToObjectUrl — zero-copy preview URL.
 * Uses URL.createObjectURL() which is instant and never encodes to base64.
 * MUST call URL.revokeObjectURL(url) when done to free memory.
 */
export const fileToObjectUrl = (file) => URL.createObjectURL(file)

/**
 * fileToArrayBuffer — read file as raw bytes for transfer to worker.
 * ArrayBuffer is transferable — postMessage moves it without copying.
 */
export const fileToArrayBuffer = (file) => file.arrayBuffer()
