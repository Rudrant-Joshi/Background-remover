import axios from 'axios'

const N8N_PROCESS_URL = import.meta.env.VITE_N8N_PROCESS_WEBHOOK
const N8N_CREATE_ORDER_URL = import.meta.env.VITE_N8N_CREATE_ORDER_WEBHOOK

/**
 * Send image to n8n for AI processing
 * @param {object} payload
 * @returns {Promise<{resultUrl: string, uploadId: string}>}
 */
export async function processImage(payload) {
  const { data } = await axios.post(N8N_PROCESS_URL, payload, {
    timeout: 60000, // 60s for AI processing
    headers: { 'Content-Type': 'application/json' },
  })

  if (!data?.resultUrl) {
    throw new Error('Processing failed — no result URL received')
  }

  return data
}

/**
 * Create Razorpay order via n8n
 * @param {object} payload
 * @returns {Promise<{orderId: string, amount: number, currency: string}>}
 */
export async function createOrder(payload) {
  const { data } = await axios.post(N8N_CREATE_ORDER_URL, payload, {
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
  })

  if (!data?.orderId) {
    throw new Error('Failed to create payment order')
  }

  return data
}

/**
 * Load Razorpay checkout script
 * @returns {Promise<boolean>}
 */
export function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

/**
 * Open Razorpay checkout modal
 * @param {object} options
 * @returns {Promise<{paymentId: string, orderId: string, signature: string}>}
 */
export function openRazorpayCheckout(options) {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      ...options,
      handler: (response) => {
        resolve({
          paymentId: response.razorpay_payment_id,
          orderId: response.razorpay_order_id,
          signature: response.razorpay_signature,
        })
      },
      modal: {
        ondismiss: () => reject(new Error('Payment cancelled')),
      },
      theme: {
        color: '#D9A178',
      },
    })
    rzp.open()
  })
}

/**
 * Send image binary directly to n8n AI webhook using FormData
 * @param {File} file - The original image file
 * @returns {Promise<{url: string}>} - The response containing the result URL
 */
export async function removeBackgroundBinary(file) {
  const isDev = import.meta.env.DEV
  const endpoint = isDev 
    ? '/api/n8n-remove-bg' 
    : (import.meta.env.VITE_N8N_REMOVE_BG_WEBHOOK || 'https://prefix.app.n8n.cloud/webhook/remove-bg')

  const formData = new FormData()
  formData.append('image', file)

  const { data } = await axios.post(endpoint, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 60s for AI processing
  })

  if (!data?.imageUrl) {
    throw new Error('Failed to remove background. No imageUrl returned in response.')
  }

  return { url: data.imageUrl }
}
