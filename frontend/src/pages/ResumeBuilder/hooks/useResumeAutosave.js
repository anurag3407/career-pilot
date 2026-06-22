import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'careerpilot:resumeBuilderDraft'
const SAVE_DEBOUNCE_MS = 1000

/**
 * Debounced autosave of the resume wizard's draft to localStorage, with
 * restore-on-load support.
 *
 * Usage:
 *   const autosave = useResumeAutosave(draftData)
 *   // draftData is any plain-object snapshot of the wizard's form state
 *
 *   if (autosave.restoreAvailable) {
 *     // show a banner; on click:
 *     autosave.restoreDraft((draft) => { ...apply draft fields to state setters... })
 *   }
 *
 *   // after a successful submit:
 *   autosave.clearDraft()
 */
export function useResumeAutosave(draftData, { enabled = true } = {}) {
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [restoreAvailable, setRestoreAvailable] = useState(false)
  const [pendingDraft, setPendingDraft] = useState(null)

  const saveTimerRef = useRef(null)
  const hydratedRef = useRef(false)

  // On mount: look for a draft left over from a previous session.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setPendingDraft(parsed)
        setRestoreAvailable(true)
      }
    } catch {
      // Corrupted or inaccessible storage — treat as "no draft".
    } finally {
      hydratedRef.current = true
    }
  }, [])

  // Debounced save whenever the draft data changes.
  useEffect(() => {
    if (!enabled || !hydratedRef.current) return

    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      try {
        const payload = { ...draftData, savedAt: Date.now() }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        setLastSavedAt(payload.savedAt)
      } catch {
        // Storage full/unavailable/private-mode — fail silently, autosave
        // is a convenience feature, not a hard requirement.
      }
    }, SAVE_DEBOUNCE_MS)

    return () => clearTimeout(saveTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(draftData), enabled])

  const restoreDraft = useCallback((onRestore) => {
    if (pendingDraft) onRestore(pendingDraft)
    setRestoreAvailable(false)
  }, [pendingDraft])

  const dismissDraft = useCallback(() => {
    setRestoreAvailable(false)
  }, [])

  const clearDraft = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY) } catch { /* ignore */ }
    setLastSavedAt(null)
  }, [])

  return { lastSavedAt, restoreAvailable, pendingDraft, restoreDraft, dismissDraft, clearDraft }
}
