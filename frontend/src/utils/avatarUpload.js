import { uploadToImageKit, getOptimizedImageUrl } from '../services/imagekit'
import { supabase, isSupabaseConfigured } from '../config/supabase'
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
 * Uploads an avatar image to ImageKit (Primary) with Supabase & Appwrite fallback.
 * Automatically applies face-centered cropping and WebP/AVIF CDN optimization.
 */
export async function uploadAvatar(file, uid, onProgress) {
  if (!uid) {
    throw new Error('You must be signed in to upload an avatar.')
  }

  const check = validateAvatarFile(file)
  if (!check.ok) throw new Error(check.error)

  const fileExt = file.name ? file.name.split('.').pop() : 'png'
  const fileName = `avatar_${uid}_${Date.now()}.${fileExt}`

  // 1. Primary: ImageKit (Free 20GB Object Storage + CloudFront CDN + Face Crop)
  try {
    if (onProgress) onProgress(20)
    const result = await uploadToImageKit({
      file,
      fileName,
      folder: '/avatars',
      tags: ['avatar', uid],
      userId: uid,
      onProgress: (p) => onProgress && onProgress(Math.floor(p * 0.9)),
    })

    if (result && result.url) {
      if (onProgress) onProgress(100)
      // Return optimized URL with high-res face crop
      return getOptimizedImageUrl(result.url, {
        width: 300,
        height: 300,
        focus: 'face',
        quality: 90,
      })
    }
  } catch (ikErr) {
    console.warn('ImageKit avatar upload failed, attempting Supabase fallback:', ikErr.message)
  }

  // 2. Fallback: Supabase Storage if configured
  if (isSupabaseConfigured) {
    try {
      if (onProgress) onProgress(30)
      const filePath = `${uid}/${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (error) throw error

      if (onProgress) onProgress(90)
      const { data: publicUrlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      if (onProgress) onProgress(100)
      return publicUrlData.publicUrl
    } catch (supaErr) {
      console.warn('Supabase storage upload failed, attempting Appwrite fallback:', supaErr.message)
    }
  }

  // 3. Fallback: Appwrite Storage
  const BUCKET_ID = import.meta.env.VITE_APPWRITE_BUCKET_ID || 'avatars'
  try {
    if (onProgress) onProgress(50)
    const response = await storage.createFile(BUCKET_ID, ID.unique(), file)
    if (onProgress) onProgress(100)
    return storage.getFileView(BUCKET_ID, response.$id).href
  } catch (err) {
    console.error('All avatar upload providers failed:', err)
    throw new Error(err?.message || 'Avatar upload failed.')
  }
}
