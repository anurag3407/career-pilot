/**
 * ImageKit Service for CareerPilot
 * Provides unified, free object storage for profile avatars, resume PDFs, and exports.
 */

const GATEWAY_URL = import.meta.env.VITE_AI_GATEWAY_URL || '/gateway/v1';

export const IMAGEKIT_PUBLIC_KEY = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY || 'public_HbKrLXFCb5VWNjz7jBfAteEOhBM=';
export const IMAGEKIT_URL_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT || 'https://ik.imagekit.io/anurag3407';

/**
 * Upload any file (Image, PDF, Document) to ImageKit via CareerPilot AI Gateway.
 *
 * @param {Object} options
 * @param {File|Blob|string} options.file - File object, Blob, or base64 data URL
 * @param {string} options.fileName - Destination filename
 * @param {string} [options.folder='/uploads'] - ImageKit folder (e.g. '/avatars', '/resumes')
 * @param {string[]} [options.tags=[]] - Tags to attach
 * @param {string} [options.userId] - Current user id
 * @param {Function} [options.onProgress] - Optional progress callback (0-100)
 * @returns {Promise<{ url: string, fileId: string, name: string, thumbnail: string }>}
 */
export async function uploadToImageKit({
  file,
  fileName,
  folder = '/uploads',
  tags = [],
  userId = '',
  onProgress,
}) {
  if (onProgress) onProgress(20);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('fileName', fileName || `file_${Date.now()}`);
  formData.append('folder', folder);
  if (tags && tags.length > 0) {
    formData.append('tags', Array.isArray(tags) ? tags.join(',') : tags);
  }

  const endpoint = `${GATEWAY_URL.replace(/\/$/, '')}/imagekit/upload`;

  if (onProgress) onProgress(45);

  const headers = {};
  if (userId) {
    headers['X-User-Id'] = userId;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (onProgress) onProgress(85);

  const result = await response.json().catch(() => ({}));

  if (!response.ok || !result.success) {
    throw new Error(result.error || `ImageKit upload failed with status ${response.status}`);
  }

  if (onProgress) onProgress(100);

  return {
    url: result.url,
    fileId: result.fileId,
    name: result.name,
    thumbnail: result.thumbnail || result.url,
    size: result.size,
  };
}

/**
 * Returns an optimized ImageKit URL with transformation parameters.
 *
 * @param {string} url - Original ImageKit URL
 * @param {Object} [transforms={}]
 * @param {number} [transforms.width]
 * @param {number} [transforms.height]
 * @param {boolean} [transforms.circle=false]
 * @param {string} [transforms.focus='face'] - 'face' | 'auto' | 'center'
 * @param {number} [transforms.quality=80]
 * @returns {string}
 */
export function getOptimizedImageUrl(url, {
  width,
  height,
  circle = false,
  focus = 'face',
  quality = 85,
} = {}) {
  if (!url || !url.includes('ik.imagekit.io')) return url;

  const trParams = [];
  if (width) trParams.push(`w-${width}`);
  if (height) trParams.push(`h-${height}`);
  if (focus) trParams.push(`fo-${focus}`);
  if (circle) trParams.push('r-max');
  if (quality) trParams.push(`q-${quality}`);

  if (trParams.length === 0) return url;

  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tr=${trParams.join(',')}`;
}
