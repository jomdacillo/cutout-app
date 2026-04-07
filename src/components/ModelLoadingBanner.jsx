import { useEffect, useState } from 'react'
import { Cpu, CheckCircle, AlertCircle, X } from 'lucide-react'
import { MODEL_STATE } from '../hooks/useRmbgWorker'
import styles from './ModelLoadingBanner.module.css'

/**
 * ModelLoadingBanner
 *
 * Industry-standard non-blocking loading indicator — like Figma's
 * "Loading assets…" bar, VS Code's extension loading, or Canva's
 * resource preloader. Slides up from the bottom, shows real progress,
 * auto-dismisses 2.5s after ready, and never shows again once cached.
 *
 * Props:
 *   state    — MODEL_STATE from useRmbgWorker
 *   progress — 0–100 number
 *   device   — 'webgpu' | 'wasm' | null
 *   error    — error message string | null
 */
export default function ModelLoadingBanner({ state, progress, device, error }) {
  const [visible,   setVisible]   = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [readyAnim, setReadyAnim] = useState(false)

  const isLoading    = state === MODEL_STATE.LOADING || state === MODEL_STATE.IDLE
  const isReady      = state === MODEL_STATE.READY
  const isError      = state === MODEL_STATE.ERROR

  // Show banner as soon as loading starts
  useEffect(() => {
    if (isLoading && !dismissed) setVisible(true)
  }, [isLoading, dismissed])

  // When ready — show success state, then auto-dismiss after 2.5s
  useEffect(() => {
    if (isReady && visible) {
      setReadyAnim(true)
      const t = setTimeout(() => {
        setVisible(false)
        setDismissed(true)
      }, 2500)
      return () => clearTimeout(t)
    }
  }, [isReady, visible])

  // Show error state — user can manually dismiss
  useEffect(() => {
    if (isError) setVisible(true)
  }, [isError])

  if (!visible) return null

  const deviceLabel = device === 'webgpu' ? 'WebGPU · GPU accelerated'
                    : device === 'wasm'   ? 'WebAssembly · CPU fallback'
                    : 'Detecting best backend…'

  return (
    <div
      className={`
        ${styles.banner}
        ${readyAnim ? styles.bannerReady : ''}
        ${isError   ? styles.bannerError : ''}
      `}
      role="status"
      aria-live="polite"
      aria-label={isReady ? 'AI model ready' : `Loading AI model: ${progress}%`}
    >
      {/* Left — icon */}
      <div className={styles.iconWrap}>
        {isError ? (
          <AlertCircle size={18} className={styles.iconError} />
        ) : readyAnim ? (
          <CheckCircle size={18} className={styles.iconReady} />
        ) : (
          <div className={styles.spinner} />
        )}
      </div>

      {/* Center — text + progress bar */}
      <div className={styles.body}>
        <div className={styles.textRow}>
          <span className={styles.title}>
            {isError   ? 'Failed to load AI model'
             : readyAnim ? `AI model ready`
             : progress < 5 ? 'Initialising AI model…'
             : `Loading AI model… ${Math.round(progress)}%`}
          </span>
          {!isError && !readyAnim && (
            <span className={styles.sub}>{deviceLabel}</span>
          )}
          {readyAnim && device && (
            <span className={styles.sub}>{deviceLabel}</span>
          )}
          {isError && error && (
            <span className={styles.subError}>{error}</span>
          )}
        </div>

        {!isError && (
          <div className={styles.track} role="progressbar" aria-valuenow={Math.round(progress)}>
            <div
              className={`${styles.fill} ${readyAnim ? styles.fillReady : ''}`}
              style={{ width: readyAnim ? '100%' : `${Math.max(progress, 3)}%` }}
            />
          </div>
        )}
      </div>

      {/* Right — once-cached note or dismiss */}
      <div className={styles.right}>
        {!readyAnim && !isError && (
          <span className={styles.cacheNote}>Downloads once · cached forever</span>
        )}
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
  )
}
