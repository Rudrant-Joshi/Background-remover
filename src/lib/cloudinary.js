// Cloudinary service — upload to temp bucket
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'snapcut_temp'

const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`

/**
 * Upload a file to Cloudinary using unsigned preset
 * @param {File} file - The image file to upload
 * @param {Function} onProgress - Progress callback (0-100)
 * @returns {Promise<{url: string, publicId: string}>}
 */
export async function uploadToCloudinary(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'snapcut/originals')
  formData.append('tags', 'temp,original')

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress(percent)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        const data = JSON.parse(xhr.responseText)
        resolve({
          url: data.secure_url,
          publicId: data.public_id,
          width: data.width,
          height: data.height,
          bytes: data.bytes,
          format: data.format,
        })
      } else {
        const error = JSON.parse(xhr.responseText)
        reject(new Error(error.error?.message || 'Upload failed'))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Upload failed — network error')))
    xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

    xhr.open('POST', UPLOAD_URL)
    xhr.send(formData)
  })
}

/**
 * Get a Cloudinary optimized URL
 * @param {string} publicId
 * @param {object} options
 */
export function getCloudinaryUrl(publicId, options = {}) {
  const { width, height, quality = 'auto', format = 'auto' } = options
  let transformations = `q_${quality},f_${format}`
  if (width) transformations += `,w_${width}`
  if (height) transformations += `,h_${height}`
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformations}/${publicId}`
}
