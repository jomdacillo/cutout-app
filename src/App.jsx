import { useState, useCallback, useRef } from 'react'
import Header      from './components/Header.jsx'
import ModelStatus from './components/ModelStatus.jsx'
import DropZone    from './components/DropZone.jsx'
import ResultPanel from './components/ResultPanel.jsx'
import ActionBar   from './components/ActionBar.jsx'
import InfoBar     from './components/InfoBar.jsx'
import Toast       from './components/Toast.jsx'
import useRmbgWorker, { MODEL_STATE } from './hooks/useRmbgWorker.js'
import { fileToDataUrl, formatFileSize, downloadBlobUrl } from './utils/image.js'
import styles from './App.module.css'

export default function App() {
  // ── Image state ─────────────────────────────────────────────────────────────
  const [imageDataUrl, setImageDataUrl] = useState(null)
  const [imageName,    setImageName]    = useState(null)
  const [imageSize,    setImageSize]    = useState(null)
  const [result,       setResult]       = useState(null)
  const [error,        setError]        = useState(null)
  const [toast,        setToast]        = useState(null)

  // ── Worker hook ──────────────────────────────────────────────────────────────
  const {
    modelState,
    modelProgress,
    modelDevice,
    modelError,
    removeBackground,
    isProcessing,
  } = useRmbgWorker()

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file) => {
    setError(null)
    setResult(null)
    setImageName(file.name)
    setImageSize(formatFileSize(file.size))
    const dataUrl = await fileToDataUrl(file)
    setImageDataUrl(dataUrl)
  }, [])

  const handleProcess = useCallback(async () => {
    if (!imageDataUrl) return
    setError(null)
    try {
      const url = await removeBackground(imageDataUrl)
      setResult(url)
    } catch (e) {
      setError(e.message || 'Processing failed — please try again.')
    }
  }, [imageDataUrl, removeBackground])

  const handleClear = useCallback(() => {
    setImageDataUrl(null)
    setImageName(null)
    setImageSize(null)
    setResult(null)
    setError(null)
  }, [])

  const handleDownload = useCallback(() => {
    if (!result) return
    const base = imageName ? imageName.replace(/\.[^.]+$/, '') : 'image'
    downloadBlobUrl(result, `${base}-cutout.png`)
  }, [result, imageName])

  const handleCopyToClipboard = useCallback(async () => {
    if (!result) return
    try {
      const res  = await fetch(result)
      const blob = await res.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob }),
      ])
      setToast('✓ Copied to clipboard')
    } catch {
      setToast('Clipboard copy not supported in this browser')
    }
  }, [result])

  return (
    <div className={styles.app}>
      {/* Ambient background blobs */}
      <div className={styles.blobA} aria-hidden />
      <div className={styles.blobB} aria-hidden />

      <Header device={modelDevice} />

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>
            Remove backgrounds
            <br />
            <span className={styles.heroGradient}>instantly.</span>
          </h1>
          <p className={styles.heroSub}>
            Powered by{' '}
            <a
              href="https://huggingface.co/briaai/RMBG-1.4"
              target="_blank"
              rel="noreferrer"
              className={styles.heroLink}
            >
              RMBG-1.4
            </a>
            {' '}— real AI running entirely in your browser.
            <br />No uploads, no account, no cost.
          </p>

          <ModelStatus
            modelState={modelState}
            modelProgress={modelProgress}
            modelError={modelError}
          />
        </section>

        {/* Workspace */}
        <section className={styles.workspace}>
          <DropZone
            onFile={handleFile}
            hasImage={!!imageDataUrl}
            imageUrl={imageDataUrl}
            fileName={imageName}
            fileSize={imageSize}
          />
          <ResultPanel
            result={result}
            processing={isProcessing}
            onDownload={handleDownload}
            onCopyToClipboard={handleCopyToClipboard}
          />
        </section>

        {/* Actions */}
        <ActionBar
          hasImage={!!imageDataUrl}
          hasResult={!!result}
          modelState={modelState}
          onProcess={handleProcess}
          onClear={handleClear}
          onDownload={handleDownload}
          error={error}
        />

        {/* Info */}
        <InfoBar device={modelDevice} />
      </main>

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  )
}
