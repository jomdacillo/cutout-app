import styles from './InfoBar.module.css'

export default function InfoBar({ device }) {
  return (
    <div className={styles.bar}>
      <div className={styles.item}>
        <span className={styles.icon}>🔒</span>
        <div>
          <strong>100% Private</strong>
          <p>Images never leave your device. All processing happens locally in your browser.</p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.item}>
        <span className={styles.icon}>🤖</span>
        <div>
          <strong>RMBG-1.4 by BRIA AI</strong>
          <p>
            State-of-the-art segmentation model running via{' '}
            <strong>{device === 'webgpu' ? 'WebGPU' : device === 'wasm' ? 'WebAssembly' : 'WebGPU / WASM'}</strong>.{' '}
            ~170 MB, cached after first download.
          </p>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.item}>
        <span className={styles.icon}>✦</span>
        <div>
          <strong>Completely Free</strong>
          <p>No API key, no account, no watermarks. Unlimited use.</p>
        </div>
      </div>
    </div>
  )
}
