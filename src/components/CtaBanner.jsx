import { ArrowRight } from 'lucide-react'
import styles from './CtaBanner.module.css'

export default function CtaBanner({ onTryFree }) {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <div className={styles.blob1} />
          <div className={styles.blob2} />
          <div className={styles.content}>
            <h2 className={styles.title}>Ready to remove backgrounds for free?</h2>
            <p className={styles.sub}>
              No account. No watermarks. No uploads. Just clean transparent PNGs — instantly.
            </p>
            <button className={styles.btn} onClick={onTryFree}>
              Start Removing Backgrounds
              <ArrowRight size={18} strokeWidth={2.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
