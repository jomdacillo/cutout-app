import styles from './Header.module.css'

export default function Header({ device }) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        cutout
        <span className={styles.logoSub}>by Joe Dacillo</span>
      </div>

      <nav className={styles.nav}>
        <a
          href="https://huggingface.co/briaai/RMBG-1.4"
          target="_blank"
          rel="noreferrer"
          className={styles.navLink}
        >
          Model
        </a>
        <a
          href="https://github.com/Remove-Background-ai/rembg-webgpu"
          target="_blank"
          rel="noreferrer"
          className={styles.navLink}
        >
          GitHub
        </a>
      </nav>

      <div className={styles.badge}>
        <span className={styles.badgeDot} />
        {device === 'webgpu' ? 'WebGPU · Free' : device === 'wasm' ? 'WASM · Free' : 'Free · No key'}
      </div>
    </header>
  )
}
