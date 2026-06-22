import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Format bytes to human readable
 */
export function formatBytes(bytes, decimals = 2) {
  if (!bytes || bytes === 0) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

/**
 * Format date relative (e.g., "2 hours ago")
 */
export function formatRelativeTime(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

/**
 * Format date to readable string
 */
export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

/**
 * Format currency (INR)
 */
export function formatCurrency(amount, currency = 'INR') {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount / 100) // Razorpay sends in paise
}

/**
 * Validate image file
 */
export function validateImageFile(file) {
  const maxSizeMB = parseInt(import.meta.env.VITE_MAX_FILE_SIZE_MB || '10')
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Only JPG, PNG, and WEBP are allowed.' }
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum size is ${maxSizeMB}MB.` }
  }

  return { valid: true, error: null }
}

/**
 * Generate a random API key
 */
export function generateApiKey() {
  const prefix = 'sk_live_'
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const keyLength = 32
  let key = ''
  for (let i = 0; i < keyLength; i++) {
    key += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return prefix + key
}

/**
 * Truncate text
 */
export function truncate(str, length = 30) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

/**
 * Sleep helper
 */
export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce function
 */
export function debounce(fn, delay) {
  let timeout
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => fn(...args), delay)
  }
}
