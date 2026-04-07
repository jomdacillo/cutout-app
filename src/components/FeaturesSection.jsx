import { Shield, Zap, Image, Infinity, Cpu, Smartphone } from 'lucide-react'
import styles from './FeaturesSection.module.css'

const FEATURES = [
  {
    icon: <Shield size={22} />,
    title: '100% Private',
    body: 'Your images never leave your device. All AI processing happens locally via WebGPU or WebAssembly — zero server uploads.',
    color: 'blue',
  },
  {
    icon: <Image size={22} />,
    title: 'Full Resolution Output',
    body: 'Unlike free tools that downscale results, ZeroBG preserves your original image dimensions pixel for pixel.',
    color: 'teal',
  },
  {
    icon: <Zap size={22} />,
    title: 'WebGPU Accelerated',
    body: 'On Chrome and Edge, the AI model runs on your GPU. Dramatically faster than CPU-based browser tools.',
    color: 'blue',
  },
  {
    icon: <Infinity size={22} />,
    title: 'Truly Unlimited',
    body: 'No account, no daily limits, no watermarks, no credits. Process as many images as you need — always free.',
    color: 'teal',
  },
  {
    icon: <Cpu size={22} />,
    title: 'RMBG-1.4 AI Model',
    body: "Powered by BRIA AI's state-of-the-art segmentation model. The same quality used in professional tools, free in your browser.",
    color: 'blue',
  },
  {
    icon: <Smartphone size={22} />,
    title: 'Works Everywhere',
    body: 'Runs on any modern desktop browser. Chrome and Edge give best performance. Firefox uses WASM fallback automatically.',
    color: 'teal',
  },
]

export default function FeaturesSection() {
  return (
    <section className={styles.section} id="features">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.tag}>
            <Zap size={12} />
            Features
          </div>
          <div className={styles.headRight}>
            <h2 className={styles.title}>Most popular features</h2>
            <p className={styles.sub}>Everything you need to remove backgrounds — fast, smart, and completely free.</p>
            <a href="#tool" className={styles.viewAll}>
              Try it now →
            </a>
          </div>
        </div>

        <div className={styles.grid}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`${styles.card} ${styles[`card_${f.color}`]}`}>
              <div className={`${styles.cardIcon} ${styles[`icon_${f.color}`]}`}>
                {f.icon}
              </div>
              <h3 className={styles.cardTitle}>{f.title}</h3>
              <p className={styles.cardBody}>{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
