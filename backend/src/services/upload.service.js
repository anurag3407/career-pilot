/**
 * Upload service — wraps Cloudinary raw uploads.
 *
 * Existing flow (used by resume PDF uploads) is preserved as the default
 * export. We add two named exports:
 *
 *   - uploadAudioBuffer(file): uploads a multer memory file with resource_type
 *     'video' (Cloudinary stores audio under the video resource type, which
 *     preserves duration metadata and is required for inline playback).
 *
 *   - uploadFile(buffer, fileName): legacy raw upload — unchanged.
 */

const cloudinary = require('../config/cloudinary');

async function uploadFile(buffer, fileName) {
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
async function uploadAudioBuffer(file) {
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

module.exports = uploadFile;
module.exports.uploadFile = uploadFile;
module.exports.uploadAudioBuffer = uploadAudioBuffer;
