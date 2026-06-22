const DB_NAME = 'snapcut-local-db'
const DB_VERSION = 1
const STORE_NAME = 'uploads'

/**
 * Open IndexedDB database
 */
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    
    request.onerror = () => {
      console.error('IndexedDB open error:', request.error)
      reject(request.error)
    }
    
    request.onsuccess = () => {
      resolve(request.result)
    }
    
    request.onupgradeneeded = (event) => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })
}

/**
 * Convert File or Blob object to Base64 data URL
 * @param {Blob|File} file 
 * @returns {Promise<string>}
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve('')
      return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })
}

/**
 * Fetch a URL and convert it to Base64 data URL
 * @param {string} url 
 * @returns {Promise<string>}
 */
export async function urlToBase64(url) {
  if (!url) return ''
  // If already a base64 data URL, return it
  if (url.startsWith('data:')) return url
  // If it's a blob url and we are trying to convert it, fetch can retrieve it
  try {
    const response = await fetch(url)
    const blob = await response.blob()
    return await fileToBase64(blob)
  } catch (error) {
    console.error('Failed to convert URL to base64:', error)
    return url // fallback to the URL itself
  }
}

/**
 * Save an upload record to the local IndexedDB database
 * @param {object} upload 
 * @returns {Promise<object>}
 */
export async function saveLocalUpload(upload) {
  if (!upload || !upload.id) return null
  
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(transaction.objectStoreNames[0] || STORE_NAME)
      
      // Merge with existing record if any to preserve existing base64 image data
      const getReq = store.get(upload.id)
      
      getReq.onsuccess = () => {
        const existing = getReq.result || {}
        const updatedRecord = {
          ...existing,
          ...upload,
          // Fall back to existing base64 data if not provided in new object
          original_url: upload.original_url || existing.original_url,
          result_url: upload.result_url || existing.result_url,
          created_at: upload.created_at || existing.created_at || new Date().toISOString()
        }
        
        const putReq = store.put(updatedRecord)
        
        putReq.onsuccess = () => resolve(updatedRecord)
        putReq.onerror = () => reject(putReq.error)
      }
      
      getReq.onerror = () => {
        const putReq = store.put({
          ...upload,
          created_at: upload.created_at || new Date().toISOString()
        })
        putReq.onsuccess = () => resolve(upload)
        putReq.onerror = () => reject(putReq.error)
      }
    })
  } catch (error) {
    console.error('Failed to save upload locally:', error)
    return upload
  }
}

/**
 * Retrieve all local upload records for a specific user, sorted by date descending
 * @param {string} userId 
 * @returns {Promise<Array>}
 */
export async function getLocalUploads(userId) {
  if (!userId) return []
  
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.getAll()
      
      request.onsuccess = () => {
        const results = request.result || []
        // Filter by user ID and sort by created_at descending
        const userUploads = results
          .filter(item => item.user_id === userId)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        resolve(userUploads)
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Failed to query local uploads:', error)
    return []
  }
}

/**
 * Retrieve a local upload record by its ID
 * @param {string} uploadId 
 * @returns {Promise<object|null>}
 */
export async function getLocalUploadById(uploadId) {
  if (!uploadId) return null
  
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readonly')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.get(uploadId)
      
      request.onsuccess = () => {
        resolve(request.result || null)
      }
      
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Failed to retrieve local upload by ID:', error)
    return null
  }
}

/**
 * Delete a local upload record by ID
 * @param {string} uploadId 
 * @returns {Promise<boolean>}
 */
export async function deleteLocalUpload(uploadId) {
  if (!uploadId) return false
  
  try {
    const db = await openDB()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([STORE_NAME], 'readwrite')
      const store = transaction.objectStore(STORE_NAME)
      const request = store.delete(uploadId)
      
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  } catch (error) {
    console.error('Failed to delete local upload:', error)
    return false
  }
}
