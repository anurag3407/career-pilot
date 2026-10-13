import { storage } from '../config/appwrite'
import { ID } from 'appwrite'

/**
 * Accepted avatar MIME types.
 */
export const ALLOWED_AVATAR_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

/**
 * Hard size cap (in bytes) for avatars — 5MB
 */
export const MAX_AVATAR_BYTES = 5 * 1024 * 1024 // 5 MB

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
 * Uploads an avatar image to Appwrite Storage and returns its public URL.
 */
export async function uploadAvatar(file, uid, onProgress) {
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'avatars'
  
  if (!uid) {
    throw new Error('You must be signed in to upload an avatar.')
  }

  const check = validateAvatarFile(file)
  if (!check.ok) throw new Error(check.error)

  try {
    // Note: Appwrite Web SDK v13 doesn't have an easy onProgress for createFile natively via promises,
    // though the real API supports it. We'll fire a 50% event just for UX if passed.
    if (onProgress) onProgress(50)

    const response = await storage.createFile(BUCKET_ID, ID.unique(), file)
    
    if (onProgress) onProgress(100)

    // Construct the file URL (getPreview or getFileView)
    // Appwrite returns standard URLs for viewing
    const resultUrl = storage.getFileView(BUCKET_ID, response.$id).href
    
    return resultUrl
  } catch (err) {
    console.error('Avatar upload error:', err)
    throw new Error(err?.message || 'Avatar upload failed.')
  }
}
