import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../config/firebase'

/**
 * Accepted avatar MIME types. Anything else is rejected client-side before
 * we touch Firebase Storage.
 */
export const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Hard size cap (in bytes) for avatars — 5MB matches Firebase Storage's
 * default free-tier friendly limit and keeps profile pages fast.
 */
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5 MB

/**
 * Validates a File before upload.
 *
 * @param {File} file - The browser File object selected by the user.
 * @returns {{ ok: true } | { ok: false, error: string }}
 */
export function validateAvatarFile(file) {
  if (!file) return { ok: false, error: 'No file selected.' }
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    return { ok: false, error: 'Image must be JPG, PNG, WEBP, or GIF.' }
  }
  if (file.size > MAX_AVATAR_BYTES) {
    return { ok: false, error: 'Image must be smaller than 5MB.' }
  }
  return { ok: true }
}

/**
 * Uploads an avatar image to Firebase Storage and returns its public URL.
 *
 * Flow:
 *   1. Validate the file (type + size).
 *   2. Upload to `avatars/{uid}/{timestamp}-{filename}` in Firebase Storage.
 *   3. Resolve the download URL and return it.
 *
 * The caller is responsible for persisting the returned URL to the profile
 * via `userProfileApi.setMyAvatar(url)`.
 *
 * @param {File} file - The browser File object.
 * @param {string} uid - The authenticated user's uid (storage path segment).
 * @param {(progress: number) => void} [onProgress] - Optional 0–100 progress callback.
 * @returns {Promise<string>} The Firebase Storage download URL.
 * @throws {Error} When Firebase Storage is not configured or the upload fails.
 */
export async function uploadAvatar(file, uid, onProgress) {
  if (!storage) {
    throw new Error('Firebase Storage is not configured. Set VITE_FIREBASE_* env vars.')
  }
  if (!uid) {
    throw new Error('You must be signed in to upload an avatar.')
  }

  const check = validateAvatarFile(file)
  if (!check.ok) throw new Error(check.error)

  // Sanitize filename and namespace under the user's uid so uploads never collide
  const safeName = (file.name || 'avatar').replace(/[^a-zA-Z0-9._-]/g, '_')
  const path = `avatars/${uid}/${Date.now()}-${safeName}`
  const storageRef = ref(storage, path)

  return new Promise((resolve, reject) => {
    const task = uploadBytesResumable(storageRef, file, { contentType: file.type })

    task.on(
      'state_changed',
      (snapshot) => {
        if (typeof onProgress === 'function') {
          const pct = snapshot.totalBytes
            ? Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
            : 0
          onProgress(pct)
        }
      },
      (err) => reject(new Error(err?.message || 'Avatar upload failed.')),
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        } catch (err) {
          reject(new Error(err?.message || 'Failed to retrieve avatar URL.'))
        }
      }
    )
  })
}
