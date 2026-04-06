/**
 * image.js
 * Utility helpers for image handling.
 */

/** Convert a File or Blob to a base64 data URL */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/** Format file size in human-readable form */
export function formatFileSize(bytes) {
  if (bytes < 1024)        return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** Check if a file is a supported image type */
export function isSupportedImage(file) {
  return file && ['image/png', 'image/jpeg', 'image/webp', 'image/gif'].includes(file.type)
}

/** Trigger a PNG download from a blob URL */
export function downloadBlobUrl(blobUrl, filename = 'cutout.png') {
  const a = document.createElement('a')
  a.href     = blobUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
