import { useState, useCallback, useRef } from 'react'
import Header               from './components/Header.jsx'
import Hero                 from './components/Hero.jsx'
import ToolSection          from './components/ToolSection.jsx'
import FeaturesSection      from './components/FeaturesSection.jsx'
import HowItWorks           from './components/HowItWorks.jsx'
import UseCases             from './components/UseCases.jsx'
import FAQ                  from './components/FAQ.jsx'
import CtaBanner            from './components/CtaBanner.jsx'
import Footer               from './components/Footer.jsx'
import Toast                from './components/Toast.jsx'
import AdSlot               from './components/AdSlot.jsx'
import ModelLoadingBanner   from './components/ModelLoadingBanner.jsx'
import PrivacyPolicy        from './pages/PrivacyPolicy.jsx'
import useRmbgWorker        from './hooks/useRmbgWorker.js'
import { fileToDataUrl, formatSize, download, isImage } from './utils/image.js'
import styles from './App.module.css'

const isPrivacyPage = () =>
  window.location.pathname.replace(/\/$/, '') === '/privacy'

export default function App() {
  if (isPrivacyPage()) return <PrivacyPolicy />
  const [dataUrl,   setDataUrl]   = useState(null)
  const [imageName, setImageName] = useState(null)
  const [imageSize, setImageSize] = useState(null)
  const [result,    setResult]    = useState(null)
  const [error,     setError]     = useState(null)
  const [toast,     setToast]     = useState(null)
  const dataUrlRef = useRef(null)
  const toolRef    = useRef(null)

  const { state, progress, device, error: modelError, removeBackground, isProcessing } = useRmbgWorker()

  const handleFile = useCallback(async (file) => {
    if (!isImage(file)) return
    setError(null); setResult(null)
    setImageName(file.name)
    setImageSize(formatSize(file.size))

    const du = await fileToDataUrl(file)
    setDataUrl(du)
    dataUrlRef.current = du
  }, [])

  const handleProcess = useCallback(async () => {
    if (!dataUrlRef.current) return
    setError(null)
    try {
      const url = await removeBackground(dataUrlRef.current)
      setResult(url)
    } catch (e) {
      setError(e.message || 'Processing failed — please try again.')
    }
  }, [removeBackground])

  const handleClear = useCallback(() => {
    setDataUrl(null); dataUrlRef.current = null
    setImageName(null); setImageSize(null)
    setResult(null); setError(null)
  }, [])

  const handleDownload = useCallback(() => {
    if (!result) return
    const base = imageName ? imageName.replace(/\.[^.]+$/, '') : 'image'
    download(result, `${base}-zerobg.png`)
  }, [result, imageName])

  const handleCopy = useCallback(async () => {
    if (!result) return
    try {
      const blob = await fetch(result).then(r => r.blob())
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
      setToast('Copied to clipboard!')
    } catch {
      setToast('Copy not supported in this browser')
    }
  }, [result])

  const scrollToTool = () => {
    toolRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className={styles.app}>
      <Header device={device} onTryFree={scrollToTool} />

      <main>
        {/* Hero — clean, no model status props needed */}
        <Hero onTryFree={scrollToTool} />

        {/* Ad slot — below hero, above tool */}
        <div className={styles.adWrap}>
          <AdSlot slot="1111111111" />
        </div>

        {/* Main tool */}
        <div ref={toolRef}>
          <ToolSection
            dataUrl={dataUrl}
            imageName={imageName}
            imageSize={imageSize}
            result={result}
            state={state}
            onFile={handleFile}
            onProcess={handleProcess}
            onClear={handleClear}
            onDownload={handleDownload}
            onCopy={handleCopy}
            error={error}
          />
        </div>

        {/* Features */}
        <FeaturesSection />

        {/* Ad slot — between features and how-it-works */}
        <div className={styles.adWrap}>
          <AdSlot slot="2222222222" />
        </div>

        {/* How it works */}
        <HowItWorks />

        {/* Use cases */}
        <UseCases />

        {/* FAQ */}
        <FAQ />

        {/* Ad slot — above CTA */}
        <div className={styles.adWrap}>
          <AdSlot slot="3333333333" />
        </div>

        {/* Bottom CTA */}
        <CtaBanner onTryFree={scrollToTool} />
      </main>

      <Footer />

      {/* Industry-standard non-blocking loading banner — Figma/Canva/VSCode style */}
      <ModelLoadingBanner
        state={state}
        progress={progress}
        device={device}
        error={modelError}
      />

      <Toast message={toast} onDone={() => setToast(null)} />
    </div>
  )
}
