import styles from './ResultPanel.module.css'

export default function ResultPanel({ result, processing, onDownload, onCopyToClipboard }) {
  return (
    <div className={styles.panel}>
      {/* Panel header */}
      <div className={styles.panelHeader}>
        <span className={`${styles.dot} ${result ? styles.dotDone : ''}`} />
        <span className={styles.panelLabel}>Background Removed</span>
        {result && (
          <div className={styles.headerActions}>
            <button className={styles.iconBtn} onClick={onCopyToClipboard} title="Copy to clipboard">
              ⎘
            </button>
          </div>
        )}
      </div>

      {/* Panel body */}
      <div className={`${styles.body} ${result ? styles.checker : ''}`}>
        {result ? (
          <>
            <img src={result} alt="Background removed" className={styles.preview} draggable={false} />
            <div className={styles.donePill}>✓ Done</div>
          </>
        ) : processing ? (
          <div className={styles.processingState}>
            <div className={styles.spinnerRing} />
            <span className={styles.processingText}>Running AI model…</span>
            <span className={styles.processingHint}>This may take a few seconds</span>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>✨</div>
            <div className={styles.emptyText}>
              <strong>Result appears here</strong>
              <p>Upload an image and click<br />Remove Background</p>
            </div>
          </div>
        )}
      </div>

      {/* Download bar */}
      {result && (
        <div className={styles.downloadBar}>
          <span className={styles.downloadHint}>Transparent PNG ready</span>
          <button className={styles.downloadBtn} onClick={onDownload}>
            ↓ Download PNG
          </button>
        </div>
      )}
    </div>
  )
}
