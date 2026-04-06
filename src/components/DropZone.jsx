import { useRef, useState, useCallback } from 'react'
import { isSupportedImage } from '../utils/image'
import styles from './DropZone.module.css'

export default function DropZone({ onFile, hasImage, imageUrl, fileName, fileSize }) {
  const [dragging, setDragging] = useState(false)
  const [dragError, setDragError] = useState(false)
  const inputRef = useRef()

  const handleFile = useCallback((file) => {
    setDragError(false)
    if (!isSupportedImage(file)) {
      setDragError(true)
      setTimeout(() => setDragError(false), 2000)
      return
    }
    onFile(file)
  }, [onFile])

  const onDragOver = (e) => {
    e.preventDefault()
    setDragging(true)
  }
  const onDragLeave = () => setDragging(false)
  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }
  const onInputChange = (e) => {
    if (e.target.files[0]) handleFile(e.target.files[0])
    // Reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div className={styles.panel}>
      {/* Panel header */}
      <div className={styles.panelHeader}>
        <span className={`${styles.dot} ${hasImage ? styles.dotActive : ''}`} />
        <span className={styles.panelLabel}>Original</span>
        {hasImage && (
          <button
            className={styles.changeBtn}
            onClick={() => inputRef.current?.click()}
            title="Upload a different image"
          >
            Change
          </button>
        )}
      </div>

      {/* Panel body */}
      <div
        className={`${styles.body} ${dragging ? styles.dragging : ''} ${dragError ? styles.dragError : ''}`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !hasImage && inputRef.current?.click()}
        role={hasImage ? undefined : 'button'}
        tabIndex={hasImage ? undefined : 0}
        onKeyDown={e => !hasImage && e.key === 'Enter' && inputRef.current?.click()}
        aria-label={hasImage ? undefined : 'Upload image'}
      >
        {hasImage ? (
          <img
            src={imageUrl}
            alt="Original"
            className={styles.preview}
            draggable={false}
          />
        ) : (
          <div className={styles.empty}>
            <div className={`${styles.dropIcon} ${dragging ? styles.dropIconActive : ''}`}>
              {dragError ? '⚠' : dragging ? '↓' : '🖼'}
            </div>
            <div className={styles.dropText}>
              <strong>{dragError ? 'Unsupported file type' : dragging ? 'Release to upload' : 'Drop your image here'}</strong>
              <p>{dragError ? 'Use PNG, JPG, or WEBP' : 'or click to browse — PNG, JPG, WEBP'}</p>
            </div>
          </div>
        )}
      </div>

      {/* Metadata bar */}
      {hasImage && fileName && (
        <div className={styles.meta}>
          <span className={styles.metaName}>{fileName}</span>
          {fileSize && <span className={styles.metaSize}>{fileSize}</span>}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className={styles.hiddenInput}
        onChange={onInputChange}
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
