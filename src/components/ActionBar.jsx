import styles from './ActionBar.module.css'
import { MODEL_STATE } from '../hooks/useRmbgWorker'

export default function ActionBar({
  hasImage,
  hasResult,
  modelState,
  onProcess,
  onClear,
  onDownload,
  error,
}) {
  const isReady      = modelState === MODEL_STATE.READY
  const isProcessing = modelState === MODEL_STATE.PROCESSING
  const isLoading    = modelState === MODEL_STATE.LOADING || modelState === MODEL_STATE.IDLE

  const processLabel =
    isProcessing ? 'Processing…'
    : isLoading  ? 'Loading model…'
    : '✦ Remove Background'

  return (
    <div className={styles.wrap}>
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className={styles.buttons}>
        {hasImage && (
          <button className={styles.btnGhost} onClick={onClear} disabled={isProcessing}>
            ✕ Clear
          </button>
        )}

        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={onProcess}
          disabled={!hasImage || !isReady}
        >
          {processLabel}
        </button>

        {hasResult && (
          <button className={`${styles.btn} ${styles.btnGreen}`} onClick={onDownload}>
            ↓ Download PNG
          </button>
        )}
      </div>
    </div>
  )
}
