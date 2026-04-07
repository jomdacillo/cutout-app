import { useRef, useState, useCallback } from 'react'
import { Upload, ImageIcon, Download, Copy, X, RefreshCw, Loader, CheckCircle } from 'lucide-react'
import { isImage } from '../utils/image'
import { MODEL_STATE } from '../hooks/useRmbgWorker'
import styles from './ToolSection.module.css'

export default function ToolSection({
  dataUrl, hasImage, imageName, imageSize, result,
  state, onFile, onProcess, onClear, onDownload, onCopy, error,
}) {
  const [dragging,  setDragging]  = useState(false)
  const [dragError, setDragError] = useState(false)
  const inputRef = useRef()

  const handleFile = useCallback((file) => {
    setDragError(false)
    if (!isImage(file)) { setDragError(true); setTimeout(() => setDragError(false), 2200); return }
    onFile(file)
  }, [onFile])

  const onDrop = (e) => {
    e.preventDefault(); setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const isReady      = state === MODEL_STATE.READY
  const isProcessing = state === MODEL_STATE.PROCESSING
  const isLoading    = state === MODEL_STATE.LOADING || state === MODEL_STATE.IDLE

  const btnLabel = isProcessing ? 'Processing…' : isLoading ? 'Loading AI model…' : 'Remove Background'

  return (
    <section className={styles.section} id="tool">
      <div className={styles.sectionTag}>
        <ImageIcon size={13} />
        <span>Background Remover</span>
      </div>
      <h2 className={styles.sectionTitle}>Most popular feature</h2>
      <p className={styles.sectionSub}>Upload any image and get a clean transparent PNG in seconds.</p>

      <div className={styles.workspace}>
        {/* ── Upload panel ── */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={`${styles.dot} ${dataUrl ? styles.dotBlue : ''}`} />
            <span className={styles.panelLabel}>Original</span>
            {dataUrl && (
              <button className={styles.iconBtn} onClick={() => inputRef.current?.click()} title="Change image">
                <RefreshCw size={13} />
                Change
              </button>
            )}
          </div>

          <div
            className={`${styles.panelBody} ${dragging ? styles.dragging : ''} ${dragError ? styles.dragErr : ''}`}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => !dataUrl && inputRef.current?.click()}
            role={dataUrl ? undefined : 'button'}
            tabIndex={dataUrl ? undefined : 0}
            onKeyDown={e => !dataUrl && e.key === 'Enter' && inputRef.current?.click()}
          >
            {dataUrl ? (
              <img src={dataUrl} alt="Original" className={styles.preview} draggable={false} />
            ) : (
              <div className={styles.emptyState}>
                <div className={`${styles.uploadIcon} ${dragging ? styles.uploadIconActive : ''}`}>
                  <Upload size={26} strokeWidth={1.5} />
                </div>
                <strong>{dragError ? 'Unsupported format' : dragging ? 'Drop it!' : 'Drop your image here'}</strong>
                <p>{dragError ? 'Use PNG, JPG, or WEBP' : 'or click to browse · PNG, JPG, WEBP'}</p>
              </div>
            )}
          </div>

          {dataUrl && imageName && (
            <div className={styles.panelFoot}>
              <span className={styles.fileName}>{imageName}</span>
              {imageSize && <span className={styles.fileSize}>{imageSize}</span>}
            </div>
          )}
        </div>

        {/* ── Result panel ── */}
        <div className={styles.panel}>
          <div className={styles.panelHead}>
            <div className={`${styles.dot} ${result ? styles.dotGreen : ''}`} />
            <span className={styles.panelLabel}>Background Removed</span>
            {result && (
              <button className={styles.iconBtn} onClick={onCopy} title="Copy to clipboard">
                <Copy size={13} />
                Copy
              </button>
            )}
          </div>

          <div className={`${styles.panelBody} ${result ? styles.checker : ''}`}>
            {result ? (
              <>
                <img src={result} alt="Result" className={styles.preview} draggable={false} />
                <div className={styles.doneBadge}>
                  <CheckCircle size={12} />
                  Done
                </div>
              </>
            ) : isProcessing ? (
              <div className={styles.processingState}>
                <div className={styles.spinner} />
                <strong>Running AI model…</strong>
                <p>Usually takes 3–8 seconds</p>
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.uploadIcon} style={{ background: 'var(--green-light)', border: '2px dashed rgba(16,185,129,.3)' }}>
                  <ImageIcon size={26} strokeWidth={1.5} style={{ color: 'var(--green)' }} />
                </div>
                <strong>Result appears here</strong>
                <p>Upload an image and click Remove Background</p>
              </div>
            )}
          </div>

          {result && (
            <div className={styles.panelFoot}>
              <span className={styles.fileName}>Transparent PNG · Full resolution</span>
              <button className={styles.downloadBtn} onClick={onDownload}>
                <Download size={13} />
                Download
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠ {error}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actions}>
        {dataUrl && (
          <button className={styles.clearBtn} onClick={onClear} disabled={isProcessing}>
            <X size={15} />
            Clear
          </button>
        )}
        <button
          className={styles.processBtn}
          onClick={onProcess}
          disabled={!dataUrl || !isReady}
        >
          {isProcessing
            ? <><Loader size={16} className={styles.spin} /> Processing…</>
            : isLoading
            ? <><Loader size={16} className={styles.spin} /> Loading AI model…</>
            : <><ImageIcon size={16} /> Remove Background</>
          }
        </button>
        {result && (
          <button className={styles.dlBtn} onClick={onDownload}>
            <Download size={15} />
            Download PNG
          </button>
        )}
      </div>

      {/* Trust badges */}
      <div className={styles.trustRow}>
        {['🔒 Never uploaded', '✦ Full resolution', '∞ Unlimited & free', '⚡ WebGPU powered'].map(t => (
          <span key={t} className={styles.trustBadge}>{t}</span>
        ))}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        style={{ display: 'none' }}
        onChange={e => { if (e.target.files[0]) handleFile(e.target.files[0]); e.target.value = '' }}
      />
    </section>
  )
}
