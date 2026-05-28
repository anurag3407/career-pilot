import { useCallback, useEffect, useRef, useState } from 'react';

export function useClipboard(timeout = 2000) {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const timeoutRef = useRef(null);

  const clearCopiedTimer = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const copy = useCallback(
    async (text) => {
      clearCopiedTimer();
      setCopied(false);
      setError(null);

      if (!navigator?.clipboard?.writeText) {
        const message = 'Clipboard API is not available in this browser.';
        setError(message);
        return false;
      }

      try {
        await navigator.clipboard.writeText(String(text ?? ''));
        setCopied(true);
        timeoutRef.current = window.setTimeout(() => {
          setCopied(false);
          timeoutRef.current = null;
        }, timeout);
        return true;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unable to copy to clipboard.';
        setError(message);
        return false;
      }
    },
    [clearCopiedTimer, timeout]
  );

  useEffect(() => clearCopiedTimer, [clearCopiedTimer]);

  return { copy, copied, error };
}

export default useClipboard;
