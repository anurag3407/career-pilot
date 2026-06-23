import html2canvas from 'html2canvas';

/**
 * shareCard — utilities for turning the offscreen ShareCard into a PNG and
 * sharing it on social platforms.
 */

/**
 * Capture the ShareCard DOM node into a PNG Blob.
 *
 * @param {HTMLElement} node - the offscreen card element
 * @param {object} [opts]
 * @returns {Promise<Blob>}
 */
export const captureCardToBlob = async (node, opts = {}) => {
  if (!node) throw new Error('Card element is required');
  const canvas = await html2canvas(node, {
    backgroundColor: '#0f172a',
    scale: 2,
    useCORS: true,
    logging: false,
    ...opts
  });
  return await new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'));
};

/**
 * Download a Blob as a file. Used for "Save Image" fallback.
 */
export const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * Share via the native share sheet (mobile-friendly), with a fallback to
 * Twitter intent for desktop.
 */
export const shareImage = async ({ blob, text, url, fileName = 'careerpilot-score.png' }) => {
  // Web Share API path (mobile + supported desktop browsers)
  if (navigator.canShare && typeof File !== 'undefined') {
    const file = new File([blob], fileName, { type: 'image/png' });
    if (navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], text, url });
        return { method: 'native' };
      } catch (err) {
        if (err.name === 'AbortError') return { method: 'cancelled' };
        // fall through to twitter
      }
    }
  }

  // Twitter fallback
  const tweetText = encodeURIComponent(text);
  const tweetUrl = encodeURIComponent(url || 'https://careerpilot.app');
  window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${tweetUrl}`, '_blank', 'noopener');
  return { method: 'twitter' };
};

/**
 * Build the human-readable tweet / share caption for an interview result.
 */
export const buildShareCaption = (interview) => {
  const score = Math.round(interview.overallScore || 0);
  const role = interview.jobRole || 'my next role';
  return `Just scored ${score}/100 on a CareerPilot AI mock interview for ${role} 🎯 Practice with your own AI — free, open source.`;
};
