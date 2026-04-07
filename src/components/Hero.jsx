import { ArrowRight, Users, Star } from 'lucide-react'
import ModelStatus from './ModelStatus.jsx'
import styles from './Hero.module.css'

export default function Hero({ state, progress, modelError, onTryFree }) {
  return (
    <section className={styles.heroWrap}>
      {/* The big rounded gradient card — just like the reference */}
      <div className={styles.heroCard}>
        {/* Mesh gradient blobs */}
        <div className={styles.blob1} />
        <div className={styles.blob2} />
        <div className={styles.blob3} />

        <div className={styles.heroContent}>
          {/* Social proof pill — like "Currently Editing over 100,000 photos" in ref */}
          <div className={styles.socialPill}>
            <div className={styles.avatarStack}>
              {['#0096c7','#0077b6','#00b4d8'].map((c,i) => (
                <div key={i} className={styles.avatar} style={{ background: c, zIndex: 3-i }} />
              ))}
            </div>
            <span>Trusted by designers & sellers</span>
            <Star size={12} fill="currentColor" />
          </div>

          {/* Headline */}
          <h1 className={styles.heroTitle}>
            Remove Backgrounds<br />
            <span className={styles.heroAccent}>with AI Magic</span>
          </h1>

          <p className={styles.heroSub}>
            The only truly free background remover that never uploads your images.
            Full resolution PNG, zero account, zero cost — forever.
          </p>

          {/* CTAs */}
          <div className={styles.heroCtas}>
            <button className={styles.primaryCta} onClick={onTryFree}>
              Remove Background Free
              <ArrowRight size={17} strokeWidth={2.5} />
            </button>
            <button className={styles.secondaryCta} onClick={onTryFree}>
              See how it works
            </button>
          </div>

          {/* Model status */}
          <ModelStatus state={state} progress={progress} error={modelError} />
        </div>
      </div>
    </section>
  )
}
