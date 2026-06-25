/**
 * Upload service 鈥?wraps Cloudinary raw uploads.
 *
 * Existing flow (used by resume PDF uploads) is preserved as the default
 * export. We add two named exports:
 *
 *   - uploadAudioBuffer(file): uploads a multer memory file with resource_type
 *     'video' (Cloudinary stores audio under the video resource type, which
 *     preserves duration metadata and is required for inline playback).
 *
 *   - uploadFile(buffer, fileName): legacy raw upload 鈥?unchanged.
 */

import cloudinary from '../config/cloudinary.js';

const CLOUDINARY_UPLOAD_SEGMENT = '/upload/';

export function getCloudinaryPublicIdFromUrl(url) {
  if (!url || typeof url !== 'string') return null;

  try {
    const parsed = new URL(url);
    const uploadIndex = parsed.pathname.indexOf(CLOUDINARY_UPLOAD_SEGMENT);
    if (uploadIndex === -1) return null;

    const assetPath = parsed.pathname.slice(uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length);
    const segments = assetPath.split('/').filter(Boolean);
    if (segments.length < 2) return null;

    const versionIndex = segments.findIndex((segment) => /^v\d+$/.test(segment));
    const publicIdSegments = versionIndex >= 0 ? segments.slice(versionIndex + 1) : segments.slice(1);
    if (publicIdSegments.length === 0) return null;

    const lastSegment = publicIdSegments[publicIdSegments.length - 1];
    publicIdSegments[publicIdSegments.length - 1] = lastSegment.replace(/\.[^.]+$/, '');

    const publicId = publicIdSegments.join('/');
    return publicId || null;
  } catch {
    return null;
  }
}

export async function uploadFile(buffer, fileName) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'raw',
        folder: 'resumes',
        public_id: fileName,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    ).end(buffer);
  });
}

/**
 * Upload an audio buffer (captured by MediaRecorder on the client). Uses
 * resource_type 'video' so the URL can be streamed by an <audio> element.
 */
export async function uploadAudioBuffer(file) {
  return new Promise((resolve, reject) => {
    const folder = 'interview-audio';
    const publicId = `${file.fieldname || 'audio'}-${Date.now()}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: 'video',
        folder,
        public_id: publicId,
        format: undefined // let Cloudinary detect from mime type
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    uploadStream.end(file.buffer);
  });
}

export async function deleteAudioByUrl(url) {
  const publicId = getCloudinaryPublicIdFromUrl(url);
  if (!publicId) return { deleted: false, reason: 'invalid_url' };

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
  return {
    deleted: result?.result === 'ok',
    publicId,
    result: result?.result || 'unknown',
  };
}

export default uploadFile;
