import { useEffect, useState } from 'react'
import { CheckCircle, AlertCircle, X } from 'lucide-react'
import { MODEL_STATE } from '../hooks/useRmbgWorker'
import styles from './ModelLoadingBanner.module.css'

export default function ModelLoadingBanner({ state, progress, device, error }) {
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [readyAnim, setReadyAnim] = useState(false)

  const isLoading = state === MODEL_STATE.LOADING || state === MODEL_STATE.IDLE
  const isReady   = state === MODEL_STATE.READY
  const isError   = state === MODEL_STATE.ERROR

  useEffect(() => {
    if (isLoading && !dismissed) setVisible(true)
  }, [isLoading, dismissed])

  useEffect(() => {
    if (isReady && visible) {
      setReadyAnim(true)
      const t = setTimeout(() => { setVisible(false); setDismissed(true) }, 2000)
      return () => clearTimeout(t)
    }
  }, [isReady, visible])

  useEffect(() => {
    if (isError) setVisible(true)
  }, [isError])

  if (!visible) return null

  const pct = Math.max(progress, 2)

  return (
    <>
      {/* ── Mobile: slim top progress bar (YouTube / GitHub style) ── */}
      <div
        className={`${styles.topBar} ${readyAnim ? styles.topBarReady : ''} ${isError ? styles.topBarError : ''}`}
        role="progressbar"
        aria-valuenow={Math.round(pct)}
        aria-label="Loading AI model"
      >
        <div
          className={`${styles.topBarFill} ${readyAnim ? styles.topBarFillReady : ''}`}
          style={{ width: readyAnim ? '100%' : `${pct}%` }}
        />
      </div>

      {/* ── Desktop: full floating banner ── */}
      <div
        className={`
          ${styles.banner}
          ${readyAnim ? styles.bannerReady : ''}
          ${isError   ? styles.bannerError : ''}
        `}
        role="status"
        aria-live="polite"
      >
        <div className={styles.iconWrap}>
          {isError   ? <AlertCircle size={18} className={styles.iconError} />
           : readyAnim ? <CheckCircle size={18} className={styles.iconReady} />
           : <div className={styles.spinner} />}
        </div>

        <div className={styles.body}>
          <div className={styles.textRow}>
            <span className={styles.title}>
              {isError    ? 'Failed to load AI model'
               : readyAnim ? 'AI model ready'
               : progress < 5 ? 'Initialising AI model…'
               : `Loading AI model… ${Math.round(progress)}%`}
            </span>
            {!isError && (
              <span className={styles.sub}>
                {readyAnim
                  ? device === 'webgpu' ? 'WebGPU · GPU accelerated' : 'WebAssembly · CPU'
                  : 'Downloads once · cached forever'}
              </span>
            )}
            {isError && error && <span className={styles.subError}>{error}</span>}
          </div>

          {!isError && (
            <div className={styles.track}>
              <div
                className={`${styles.fill} ${readyAnim ? styles.fillReady : ''}`}
                style={{ width: readyAnim ? '100%' : `${pct}%` }}
              />
            </div>
          )}
        </div>

        <div className={styles.right}>
          {(readyAnim || isError) && (
            <button
              className={styles.dismiss}
              onClick={() => { setVisible(false); setDismissed(true) }}
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </>
  )
}

