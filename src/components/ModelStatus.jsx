import { MODEL_STATE } from '../hooks/useRmbgWorker'
import styles from './ModelStatus.module.css'

const MESSAGES = {
  [MODEL_STATE.IDLE]:       { text: 'Initialising…',              cls: 'loading' },
  [MODEL_STATE.LOADING]:    { text: null,                          cls: 'loading' },
  [MODEL_STATE.READY]:      { text: '✦ AI model ready',           cls: 'ready'   },
  [MODEL_STATE.PROCESSING]: { text: '⚙ Running inference…',      cls: 'loading' },
  [MODEL_STATE.ERROR]:      { text: '⚠ Model failed to load',    cls: 'error'   },
}

export default function ModelStatus({ modelState, modelProgress, modelError }) {
  const info = MESSAGES[modelState] ?? MESSAGES[MODEL_STATE.IDLE]

  const label =
    modelState === MODEL_STATE.LOADING
      ? modelProgress < 5
        ? '⬇ Downloading AI model…'
        : `⬇ Downloading model… ${modelProgress}%`
      : info.text

  return (
    <div className={styles.wrap}>
      <div className={`${styles.pill} ${styles[info.cls]}`}>
        {label}
      </div>

      {modelState === MODEL_STATE.LOADING && (
        <div className={styles.progressWrap} aria-label={`Download progress: ${modelProgress}%`}>
          <div
            className={styles.progressFill}
            style={{ width: `${modelProgress}%` }}
          />
        </div>
      )}

      {modelState === MODEL_STATE.ERROR && modelError && (
        <p className={styles.errorNote}>{modelError}</p>
      )}
    </div>
  )
}
