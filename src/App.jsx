import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import AppRouter from './router/index'
import { useAuthStore } from './stores/authStore'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 2,
      refetchOnWindowFocus: false,
    },
  },
})

function AppInitializer() {
  const initialize = useAuthStore((s) => s.initialize)
  useEffect(() => {
    initialize()
  }, [initialize])
  return null
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppInitializer />
        <div className="min-h-screen bg-black text-white">
          <AppRouter />
        </div>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#111111',
              color: '#FFFFFF',
              border: '1px solid #222222',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: {
              iconTheme: { primary: '#22C55E', secondary: '#111111' },
            },
            error: {
              iconTheme: { primary: '#EF4444', secondary: '#111111' },
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
