import { useState, useEffect, useRef, useCallback } from 'react'
import { Upload, Cpu, Download, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react'
import styles from './HowItWorks.module.css'

const STEPS = [
  {
    num: '01',
    icon: <Upload size={22} strokeWidth={1.8} />,
    title: 'Upload your image',
    body: 'Drag and drop or click to upload any PNG, JPG, or WEBP image. No file size limits — full resolution supported.',
    duration: 3500,
  },
  {
    num: '02',
    icon: <Cpu size={22} strokeWidth={1.8} />,
    title: 'AI removes the background',
    body: 'RMBG-1.4 runs in your browser via WebGPU. Your image never leaves your device — completely private.',
    duration: 4000,
  },
  {
    num: '03',
    icon: <Download size={22} strokeWidth={1.8} />,
    title: 'Download your PNG',
    body: 'Get a full-resolution transparent PNG instantly. Perfect for product photos, design work, social media, and more.',
    duration: 4500,
  },
]

/* ── Step demo panels ─────────────────────────────────────────────────────── */
function UploadDemo() {
  return (
    <div className={styles.demoUpload}>
      <div className={styles.uploadBox}>
        <div className={styles.uploadIconWrap}>
          <Upload size={28} strokeWidth={1.5} />
        </div>
        <strong>Drop your image here</strong>
        <span>or click to browse · PNG, JPG, WEBP</span>
      </div>
    </div>
  )
}

function AIDemo() {
  return (
    <div className={styles.demoAI}>
      <div className={styles.aiSpinner} />
      <div className={styles.aiLabel}>Running RMBG-1.4 model…</div>
      <div className={styles.aiBarWrap}>
        <div className={styles.aiBarFill} />
      </div>
      <div className={styles.aiChecklist}>
        {['Preprocessing image', 'Running segmentation model', 'Applying mask refinement'].map((t, i) => (
          <div key={t} className={styles.aiCheckRow} style={{ animationDelay: `${i * 0.7}s` }}>
            <div className={styles.aiCheckIcon}>
              <CheckCircle size={11} />
            </div>
            <span>{t}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ResultDemo() {
  return (
    <div className={styles.demoResult}>
      <div className={styles.baGrid}>
        <div className={styles.baCard}>
          <span className={styles.baLabel}>Before</span>
          <div className={styles.baImgBefore}>
            <svg width="48" height="72" viewBox="0 0 48 72">
              <ellipse cx="24" cy="15" rx="11" ry="12" fill="#0077b6" opacity=".65" />
              <path d="M9 72 Q9 38 24 36 Q39 38 39 72Z" fill="#0077b6" opacity=".65" />
            </svg>
          </div>
        </div>
        <div className={styles.baCard}>
          <span className={styles.baLabel}>After</span>
          <div className={styles.baImgAfter}>
            <svg width="48" height="72" viewBox="0 0 48 72" className={styles.baSubject}>
              <ellipse cx="24" cy="15" rx="11" ry="12" fill="#0077b6" />
              <path d="M9 72 Q9 38 24 36 Q39 38 39 72Z" fill="#0077b6" />
            </svg>
          </div>
        </div>
      </div>
      <button className={styles.dlBtn}>
        <Download size={13} />
        Download PNG
      </button>
    </div>
  )
}

const DEMOS = [UploadDemo, AIDemo, ResultDemo]

/* ── Main component ───────────────────────────────────────────────────────── */
export default function HowItWorks() {
  const [current,  setCurrent]  = useState(0)
  const [progress, setProgress] = useState(0)
  const autoRef    = useRef(null)
  const progressRef = useRef(null)
  const startRef   = useRef(null)

  const goTo = useCallback((idx) => {
    const next = ((idx % STEPS.length) + STEPS.length) % STEPS.length
    setCurrent(next)
    setProgress(0)
  }, [])

  /* Auto-advance with smooth progress */
  useEffect(() => {
    clearTimeout(autoRef.current)
    clearInterval(progressRef.current)

    const dur = STEPS[current].duration
    startRef.current = Date.now()

    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      setProgress(Math.min((elapsed / dur) * 100, 100))
    }, 30)

    autoRef.current = setTimeout(() => {
      goTo(current + 1)
    }, dur)

    return () => {
      clearTimeout(autoRef.current)
      clearInterval(progressRef.current)
    }
  }, [current, goTo])

  const DemoPanel = DEMOS[current]

  return (
    <section className={styles.section} id="how-it-works">
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.head}>
          <span className={styles.tag}>Simple process</span>
          <h2 className={styles.title}>How ZeroBG works</h2>
          <p className={styles.sub}>Three steps. No account. No waiting. No server uploads.</p>
        </div>

        {/* Step indicator cards */}
        <div className={styles.stepCards}>
          {STEPS.map((s, i) => {
            const state = i < current ? 'done' : i === current ? 'active' : 'idle'
            return (
              <button
                key={s.num}
                className={`${styles.stepCard} ${styles[`stepCard_${state}`]}`}
                onClick={() => goTo(i)}
              >
                <div className={styles.stepCardIcon}>{s.icon}</div>
                <div className={styles.stepCardNum}>{s.num}</div>
                <div className={styles.stepCardTitle}>{s.title}</div>
                {/* Progress bar fills bottom of active card */}
                <div
                  className={styles.stepCardBar}
                  style={{
                    width: state === 'active' ? `${progress}%` : state === 'done' ? '100%' : '0%',
                    background: state === 'done' ? 'var(--green)' : undefined,
                    transition: state === 'active' ? 'none' : 'width .3s',
                  }}
                />
              </button>
            )
          })}
        </div>

        {/* Demo panel + description */}
        <div className={styles.demoWrap}>
          <div className={styles.demoPanel} key={current}>
            <DemoPanel />
          </div>

          <div className={styles.demoInfo}>
            <div className={styles.demoNum}>{STEPS[current].num}</div>
            <h3 className={styles.demoTitle}>{STEPS[current].title}</h3>
            <p className={styles.demoBody}>{STEPS[current].body}</p>

            <div className={styles.demoControls}>
              <button
                className={styles.navBtn}
                onClick={() => goTo(current - 1)}
                aria-label="Previous step"
              >
                <ChevronLeft size={16} />
              </button>

              <div className={styles.dots}>
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    className={`${styles.dot} ${i === current ? styles.dotActive : i < current ? styles.dotDone : ''}`}
                    onClick={() => goTo(i)}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>

              <button
                className={styles.navBtn}
                onClick={() => goTo(current + 1)}
                aria-label="Next step"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
