import { useEffect } from 'react'
import styles from './Toast.module.css'

export default function Toast({ message, onDone }) {
  useEffect(() => {
    if (!message) return
    const t = setTimeout(onDone, 2800)
    return () => clearTimeout(t)
  }, [message, onDone])

  if (!message) return null

  return (
    <div className={styles.toast}>
      {message}
    </div>
  )
}
