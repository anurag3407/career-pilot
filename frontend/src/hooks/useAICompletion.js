import { useState, useRef, useCallback, useEffect } from 'react'
import { enhanceApi } from '../services/api'

const DEBOUNCE_DELAY = 400
const MIN_TEXT_LENGTH = 3

/**
 * Hook that fetches inline AI completions with debouncing and abort support.
 * @param {Object} options
 * @param {string} options.sectionContext - Resume section name (e.g. "Experience")
 * @param {string} options.fieldType - Field being edited (e.g. "description", "title")
 * @param {boolean} [options.enabled=true] - Whether completions are active
 */
export function useAICompletion({ sectionContext = '', fieldType = 'description', enabled = true } = {}) {
  const [suggestion, setSuggestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const debounceTimer = useRef(null)
  const abortController = useRef(null)

  const clearPending = useCallback(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
      debounceTimer.current = null
    }
    if (abortController.current) {
      abortController.current.abort()
      abortController.current = null
    }
  }, [])

  const fetchCompletion = useCallback((text, cursorPosition) => {
    clearPending()
    setSuggestion('')
    setError(null)

    if (!enabled || !text || text.trim().length < MIN_TEXT_LENGTH) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)

    debounceTimer.current = setTimeout(async () => {
      const controller = new AbortController()
      abortController.current = controller

      try {
        const result = await enhanceApi.inlineCompletion(
          text,
          cursorPosition,
          sectionContext,
          fieldType,
          controller.signal
        )

        if (!controller.signal.aborted && result?.data?.completion) {
          setSuggestion(result.data.completion)
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message)
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false)
        }
      }
    }, DEBOUNCE_DELAY)
  }, [enabled, sectionContext, fieldType, clearPending])

  const dismiss = useCallback(() => {
    clearPending()
    setSuggestion('')
    setIsLoading(false)
  }, [clearPending])

  useEffect(() => clearPending, [clearPending])

  return { suggestion, isLoading, error, fetchCompletion, dismiss }
}
