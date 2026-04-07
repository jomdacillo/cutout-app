import { Cpu, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import { MODEL_STATE } from '../hooks/useRmbgWorker'
import styles from './ModelStatus.module.css'

export default function ModelStatus({ state, progress, error }) {
  const isLoading    = state === MODEL_STATE.LOADING || state === MODEL_STATE.IDLE
  const isReady      = state === MODEL_STATE.READY
  const isProcessing = state === MODEL_STATE.PROCESSING
  const isError      = state === MODEL_STATE.ERROR

  const icon = isReady      ? <CheckCircle size={14} />
             : isError      ? <AlertCircle size={14} />
             : isProcessing ? <Loader size={14} className={styles.spin} />
             :                <Loader size={14} className={styles.spin} />

  const label = isError      ? 'Model failed to load'
    : isReady      ? 'AI model ready — runs 100% in your browser'
    : isProcessing ? 'Processing your image…'
    : progress < 5 ? 'Initialising AI model…'
    :                `Downloading model… ${progress}%`

  const cls = isReady ? styles.ready : isError ? styles.error : styles.loading

  return (
    <div className={styles.wrap}>
      <div className={`${styles.pill} ${cls}`}>
        {icon}
        <span>{label}</span>
      </div>
      {isLoading && (
        <div className={styles.barWrap} role="progressbar" aria-valuenow={progress}>
          <div className={styles.barFill} style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  )
}
