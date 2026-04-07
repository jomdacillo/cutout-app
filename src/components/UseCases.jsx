import { ShoppingBag, User, Palette, Camera, Printer, Layout } from 'lucide-react'
import styles from './UseCases.module.css'

const CASES = [
  { icon: <ShoppingBag size={18} />, label: 'Product Photos',    desc: 'Shopify, Amazon, Etsy' },
  { icon: <User size={18} />,        label: 'Profile Pictures',  desc: 'LinkedIn, Discord, X' },
  { icon: <Palette size={18} />,     label: 'Logo & Branding',   desc: 'Transparent PNG assets' },
  { icon: <Camera size={18} />,      label: 'Passport Photos',   desc: 'White background in seconds' },
  { icon: <Printer size={18} />,     label: 'Stickers & Merch',  desc: 'Print-on-demand ready' },
  { icon: <Layout size={18} />,      label: 'Design Projects',   desc: 'Figma, Canva, Photoshop' },
]

export default function UseCases() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.head}>
          <span className={styles.tag}>Use cases</span>
          <h2 className={styles.title}>Perfect for every use case</h2>
          <p className={styles.sub}>From e-commerce to creative projects — ZeroBG handles it all.</p>
        </div>
        <div className={styles.grid}>
          {CASES.map(c => (
            <div key={c.label} className={styles.card}>
              <div className={styles.cardIcon}>{c.icon}</div>
              <div className={styles.cardText}>
                <strong>{c.label}</strong>
                <span>{c.desc}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
