import { HelpCircle } from 'lucide-react'
import styles from './FAQ.module.css'

const FAQS = [
  {
    q: 'Is ZeroBG really free?',
    a: 'Yes, completely. No hidden fees, no account, no watermarks, no daily limits. The tool runs on open-source AI technology that costs nothing to run on your device.',
  },
  {
    q: 'Are my images uploaded to a server?',
    a: "No. This is ZeroBG's key difference. The RMBG-1.4 model downloads once to your browser (~170 MB), then all processing happens locally. Your images never leave your computer — you can even verify this by opening DevTools and checking the Network tab while processing.",
  },
  {
    q: 'Why does it take a moment the first time?',
    a: 'The AI model (~170 MB) needs to download once. After that it\'s cached locally so future uses are instant. Think of it like installing a small app — you only do it once.',
  },
  {
    q: 'What image formats are supported?',
    a: 'You can upload PNG, JPG/JPEG, WEBP, and GIF. Output is always a full-resolution transparent PNG.',
  },
  {
    q: 'How does it handle complex edges like hair or fur?',
    a: 'The RMBG-1.4 model is trained on complex edge cases including hair, fur, and semi-transparent objects. We also apply bilinear interpolation and smooth-step alpha refinement when applying the mask, which significantly improves edge quality over other free tools.',
  },
  {
    q: 'Which browser works best?',
    a: 'Chrome 113+ or Edge 113+ give the best performance via WebGPU (GPU-accelerated). Firefox and older browsers use WebAssembly (CPU) which is slower but still works. Safari 18+ also supports WebGPU.',
  },
  {
    q: 'How does ZeroBG compare to remove.bg or Canva?',
    a: 'remove.bg charges for full-resolution downloads. Canva requires a Pro subscription for unlimited use. ZeroBG gives full-resolution transparent PNGs with no account, no cost, and crucially — your images never leave your device.',
  },
]

export default function FAQ() {
  return (
    <section className={styles.section} id="faq">
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.tag}>
            <HelpCircle size={12} />
            FAQ
          </div>
          <h2 className={styles.title}>Common questions</h2>
          <p className={styles.sub}>Everything you need to know about ZeroBG.</p>
        </div>

        <div className={styles.list}>
          {FAQS.map(f => (
            <details key={f.q} className={styles.item}>
              <summary className={styles.question}>{f.q}</summary>
              <p className={styles.answer}>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
