import { useEffect } from 'react'
import styles from './AdSlot.module.css'

/**
 * AdSlot — drop-in Google AdSense component.
 *
 * Before approval:  renders a clean placeholder (invisible to users, visible in dev)
 * After approval:
 *   1. Uncomment AdSense script in index.html
 *   2. Set VITE_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX in .env
 *   3. Pass approved={true} to each <AdSlot />
 *   4. Replace slot IDs with your real ad unit IDs
 */
export default function AdSlot({ slot, format = 'auto', className = '', approved = false }) {
  useEffect(() => {
    if (!approved) return
    try { window.adsbygoogle?.push({}) } catch {}
  }, [approved])

  const client = import.meta.env.VITE_ADSENSE_CLIENT || ''

  if (approved && client) {
    return (
      <div className={`${styles.wrap} ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      </div>
    )
  }

  // Dev placeholder — subtle so it doesn't break layout
  return (
    <div className={`${styles.placeholder} ${className}`}>
      <span className={styles.label}>Advertisement</span>
    </div>
  )
}
