/**
 * Save a Blob to the user's disk with the browser's own download flow.
 *
 * Both exporters go through here so they behave identically: an object URL,
 * an anchor carrying `download="<name>"`, a real click, and a revoke. The
 * revoke is deferred because Safari cancels a download when its object URL is
 * released in the same task as the click.
 */
export const DOWNLOAD_REVOKE_DELAY_MS = 1000

export function downloadBlob(blob, filename, { revokeDelayMs = DOWNLOAD_REVOKE_DELAY_MS } = {}) {
  if (!blob) throw new Error('downloadBlob: a Blob is required')
  if (typeof document === 'undefined' || typeof URL === 'undefined' || !URL.createObjectURL) {
    return null
  }

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.rel = 'noopener'
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => {
    try {
      URL.revokeObjectURL(url)
    } catch {
      /* the platform already released it */
    }
  }, revokeDelayMs)
  return url
}
