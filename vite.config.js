import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const webhookUrl = env.VITE_N8N_REMOVE_BG_WEBHOOK || 'https://prefix.app.n8n.cloud/webhook/remove-bg'

  let targetOrigin = 'https://prefix.app.n8n.cloud'
  try {
    const parsedUrl = new URL(webhookUrl)
    targetOrigin = parsedUrl.origin
  } catch (e) {
    console.error('Invalid VITE_N8N_REMOVE_BG_WEBHOOK URL:', webhookUrl)
  }

  let targetPath = '/webhook/remove-bg'
  try {
    const parsedUrl = new URL(webhookUrl)
    targetPath = parsedUrl.pathname
  } catch (e) {}

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api/n8n-remove-bg': {
          target: targetOrigin,
          changeOrigin: true,
          secure: false,
          configure: (proxy, options) => {
            proxy.on('error', (err, req, res) => {
              console.log('proxy error', err);
            });
            proxy.on('proxyReq', (proxyReq, req, res) => {
              console.log('Sending Request to the Target:', req.method, req.url, '->', targetOrigin + proxyReq.path);
            });
            proxy.on('proxyRes', (proxyRes, req, res) => {
              console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
            });
          },
          rewrite: (path) => path.replace(/^\/api\/n8n-remove-bg/, targetPath),
        }
      }
    }
  }
})

