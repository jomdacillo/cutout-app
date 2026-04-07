import { Scissors, Zap, Github } from 'lucide-react'
import styles from './Header.module.css'

export default function Header({ device, onTryFree }) {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Logo */}
        <a href="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Scissors size={16} strokeWidth={2.5} />
          </div>
          <span>ZeroBG</span>
        </a>

        {/* Nav pills — matches reference style */}
        <nav className={styles.nav} aria-label="Main navigation">
          <a href="#" className={`${styles.navLink} ${styles.navLinkActive}`}>Home</a>
          <a href="#features" className={styles.navLink}>Features</a>
          <a href="#how-it-works" className={styles.navLink}>How it works</a>
          <a href="#faq" className={styles.navLink}>FAQ</a>
        </nav>

        {/* Right actions */}
        <div className={styles.actions}>
          <a
            href="https://github.com/jomdacillo/cutout-app"
            target="_blank"
            rel="noreferrer"
            className={styles.ghostBtn}
          >
            <Github size={15} />
            GitHub
          </a>
          <button className={styles.ctaBtn} onClick={onTryFree}>
            <Zap size={15} strokeWidth={2.5} />
            Try for Free
          </button>
        </div>
      </div>
    </header>
  )
}
