import { useEffect, useRef, useState, useCallback } from 'react'
import { applyMask } from '../utils/image.js'
import RmbgWorker from '../worker/rmbg.worker.js?worker'

export const MODEL_STATE = { IDLE:'idle', LOADING:'loading', READY:'ready', PROCESSING:'processing', ERROR:'error' }

export default function useRmbgWorker() {
  const workerRef   = useRef(null)
  const inflightRef = useRef({})
  const dataUrlRef  = useRef(null)

  const [state,    setState]    = useState(MODEL_STATE.IDLE)
  const [progress, setProgress] = useState(0)
  const [device,   setDevice]   = useState(null)
  const [error,    setError]    = useState(null)

  useEffect(() => {
    const w = new RmbgWorker()
    workerRef.current = w

    w.onmessage = async ({ data: msg }) => {
      if (msg.type === 'progress') {
        setProgress(msg.pct)
      } else if (msg.type === 'ready') {
        setState(MODEL_STATE.READY); setProgress(100); setDevice(msg.device)
      } else if (msg.type === 'result') {
        const { resolve } = inflightRef.current
        inflightRef.current = {}
        try {
          const url = await applyMask(dataUrlRef.current, msg.mask)
          resolve?.(url)
        } catch (e) { inflightRef.current.reject?.(e) }
        setState(MODEL_STATE.READY)
      } else if (msg.type === 'error') {
        if (msg.fatal) { setState(MODEL_STATE.ERROR); setError(msg.message) }
        else { inflightRef.current.reject?.(new Error(msg.message)); inflightRef.current = {}; setState(MODEL_STATE.READY) }
      }
    }

    w.onerror = (e) => { setState(MODEL_STATE.ERROR); setError(e.message) }
    setState(MODEL_STATE.LOADING)
    w.postMessage({ type: 'load' })
    return () => { w.terminate(); workerRef.current = null }
  }, [])

  const removeBackground = useCallback((imageDataUrl) => new Promise((resolve, reject) => {
    if (!workerRef.current || state !== MODEL_STATE.READY) { reject(new Error('Not ready')); return }
    dataUrlRef.current  = imageDataUrl
    inflightRef.current = { resolve, reject }
    setState(MODEL_STATE.PROCESSING)
    workerRef.current.postMessage({ type: 'run', imageDataUrl })
  }), [state])

  return {
    state, progress, device, error, removeBackground,
    isReady:      state === MODEL_STATE.READY,
    isLoading:    state === MODEL_STATE.LOADING,
    isProcessing: state === MODEL_STATE.PROCESSING,
    hasError:     state === MODEL_STATE.ERROR,
  }
}
