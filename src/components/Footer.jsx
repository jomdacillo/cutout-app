import { Scissors, Github, ExternalLink } from 'lucide-react'
import styles from './Footer.module.css'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <Scissors size={14} strokeWidth={2.5} />
          </div>
          <div>
            <div className={styles.logoName}>ZeroBG</div>
            <div className={styles.logoTag}>Free AI Background Remover</div>
          </div>
        </div>

        <nav className={styles.links}>
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <a href="#faq">FAQ</a>
          <a href="/privacy">Privacy Policy</a>
          <a href="https://huggingface.co/briaai/RMBG-1.4" target="_blank" rel="noreferrer">
            Model <ExternalLink size={11} />
          </a>
          <a href="https://github.com/jomdacillo/cutout-app" target="_blank" rel="noreferrer">
            <Github size={14} /> GitHub
          </a>
        </nav>

        <div className={styles.copy}>
          <p>© {year} ZeroBG · Built with <a href="https://huggingface.co/docs/transformers.js" target="_blank" rel="noreferrer">Transformers.js</a> & <a href="https://huggingface.co/briaai/RMBG-1.4" target="_blank" rel="noreferrer">RMBG-1.4</a></p>
          <p className={styles.copySmall}>Your images never leave your device · 100% client-side AI</p>
        </div>
      </div>
    </footer>
  )
}
