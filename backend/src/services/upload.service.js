/**
 * Upload service — wraps Cloudinary raw uploads.
 *
 * Existing flow (used by resume PDF uploads) is preserved as the default
 * export. We add three named exports:
 *
 * - uploadAudioBuffer(file): uploads a multer memory file with resource_type
 * 'video' (Cloudinary stores audio under the video resource type, which
 * preserves duration metadata and is required for inline playback).
 *
 * - uploadFile(buffer, fileName): legacy raw upload — unchanged.
 * * - deleteAudioByUrl(url): cleans up audio assets during mock interview deletion.
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

/**
 * Deletes an audio recording from Cloudinary by its secure URL
 * @param {string} url - The Cloudinary secure_url
 */
async function deleteAudioByUrl(url) {
  try {
    if (!url) return;
    
    // Extract public_id from a standard Cloudinary URL
    // Format: https://res.cloudinary.com/<cloud>/video/upload/v<version>/<folder>/<filename>.<ext>
    const urlParts = url.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1) {
      console.warn('Invalid Cloudinary URL format provided for deletion.');
      return;
    }
    
    // Join the path after the version string (v1234...) and strip the extension
    const pathParts = urlParts.slice(uploadIndex + 2); 
    const fullFilename = pathParts.join('/');
    const publicId = fullFilename.substring(0, fullFilename.lastIndexOf('.'));

    // Cloudinary treats audio as 'video', so we must specify it during destruction
    await cloudinary.uploader.destroy(publicId, { resource_type: 'video' });
  } catch (error) {
    console.error(`Failed to delete audio from Cloudinary (${url}):`, error);
  }
}

module.exports = uploadFile;
module.exports.uploadFile = uploadFile;
module.exports.uploadAudioBuffer = uploadAudioBuffer;
module.exports.deleteAudioByUrl = deleteAudioByUrl;
