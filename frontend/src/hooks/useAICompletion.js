import { useCallback, useEffect, useRef, useState } from 'react'
import { aiApi } from '../services/api'

const DEBOUNCE_MS = 600
const MIN_CHARS = 12 // don't suggest until there's enough context to complete

/**
 * useAICompletion — Copilot-style inline suggestions for a text field.
 *
 * Call `request(text)` on every change; it debounces, aborts any in-flight
 * request, and skips work when the text is too short or unchanged. The pending
 * `suggestion` is the continuation to append after the user's text.
 *
 * @param {{ sectionName?: string, field?: string, enabled?: boolean }} opts
 * @returns {{ suggestion: string, loading: boolean, request: (text:string)=>void,
 *            accept: ()=>string, dismiss: ()=>void }}
 */
export default function useAICompletion({ sectionName, field = 'description', enabled = true } = {}) {
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)

  const timerRef = useRef(null)
  const abortRef = useRef(null)
  const lastQueryRef = useRef('') // text we last asked (or decided not to ask) about

  const cancelPending = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null }
    if (abortRef.current) { abortRef.current.abort(); abortRef.current = null }
    // Clearing abortRef means the aborted request's finally can't reset loading,
    // so reset it here — otherwise the UI can stay stuck on "Thinking…".
    setLoading(false)
  }, [])

  const dismiss = useCallback(() => {
    cancelPending()
    setSuggestion('')
    setLoading(false)
  }, [cancelPending])

  const request = useCallback((text) => {
    if (!enabled) return
    const value = text ?? ''

    // Clear any showing suggestion the moment the text changes.
    setSuggestion('')
    cancelPending()

    if (value.trim().length < MIN_CHARS || value === lastQueryRef.current) return

    timerRef.current = setTimeout(async () => {
      lastQueryRef.current = value
      const controller = new AbortController()
      abortRef.current = controller
      setLoading(true)
      try {
        const res = await aiApi.resumeSuggestion(
          { sectionName, field, text: value },
          controller.signal,
        )
        // Ignore if a newer request superseded this one.
        if (abortRef.current === controller) {
          setSuggestion((res?.suggestion || '').trim())
        }
      } catch (err) {
        if (err?.name !== 'AbortError') setSuggestion('')
      } finally {
        if (abortRef.current === controller) { setLoading(false); abortRef.current = null }
      }
    }, DEBOUNCE_MS)
  }, [enabled, sectionName, field, cancelPending])

  const accept = useCallback(() => {
    const value = suggestion
    dismiss()
    return value
  }, [suggestion, dismiss])

  // Abort/cleanup on unmount.
  useEffect(() => cancelPending, [cancelPending])

  return { suggestion, loading, request, accept, dismiss }
}
