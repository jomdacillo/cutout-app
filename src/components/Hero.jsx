import { ArrowRight, Star } from 'lucide-react'
import styles from './Hero.module.css'

export default function Hero({ onTryFree }) {
  return (
    <section className={styles.heroWrap}>
      <div className={styles.heroCard}>
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        <div className={styles.heroContent}>
          {/* Social proof pill */}
          <div className={styles.socialPill}>
            <div className={styles.avatarStack}>
              {['#0096c7','#0077b6','#00b4d8'].map((c, i) => (
                <div key={i} className={styles.avatar} style={{ background: c, zIndex: 3 - i }} />
              ))}
            </div>
            <span>Trusted by designers & sellers</span>
            <Star size={12} fill="currentColor" />
          </div>

          <h1 className={styles.heroTitle}>
            Remove Backgrounds<br />
            <span className={styles.heroAccent}>with AI Magic</span>
          </h1>

          <p className={styles.heroSub}>
            The only truly free background remover that never uploads your images.
            Full resolution PNG, zero account, zero cost — forever.
          </p>

          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={onTryFree}>
              Remove Background Free
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>
            <button className={styles.secondaryCta} onClick={onTryFree}>
              See how it works
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
