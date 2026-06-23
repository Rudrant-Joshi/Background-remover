import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

// Layouts
import PublicLayout from '../components/layout/PublicLayout'
import DashboardLayout from '../components/layout/DashboardLayout'
import AdminLayout from '../components/layout/AdminLayout'
import AuthLayout from '../components/layout/AuthLayout'

// Public Pages
import LandingPage from '../pages/public/LandingPage'
import FeaturesPage from '../pages/public/FeaturesPage'
import PricingPage from '../pages/public/PricingPage'
import AboutPage from '../pages/public/AboutPage'
import ContactPage from '../pages/public/ContactPage'
import PrivacyPage from '../pages/public/PrivacyPage'
import TermsPage from '../pages/public/TermsPage'

// Auth Pages
import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import VerifyEmailPage from '../pages/auth/VerifyEmailPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

// User Pages
import DashboardPage from '../pages/user/DashboardPage'
import UploadPage from '../pages/user/UploadPage'
import PreviewPage from '../pages/user/PreviewPage'
import DownloadsPage from '../pages/user/DownloadsPage'
import BillingPage from '../pages/user/BillingPage'
import CreditsPage from '../pages/user/CreditsPage'
import SettingsPage from '../pages/user/SettingsPage'

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import AdminAnalytics from '../pages/admin/AdminAnalytics'
import AdminLogs from '../pages/admin/AdminLogs'
import AdminPayments from '../pages/admin/AdminPayments'

// Guards
function ProtectedRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuthStore()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin()) return <Navigate to="/dashboard" replace />
  return children
}

function GuestRoute({ children }) {
  const { user, loading } = useAuthStore()
  if (loading) return null
  if (user) return <Navigate to="/dashboard" replace />
  return children
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
      </Route>

      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><RegisterPage /></GuestRoute>} />
        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
        <Route path="/reset-password" element={<GuestRoute><ResetPasswordPage /></GuestRoute>} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>

      {/* User Routes (Protected) */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/preview/:id" element={<PreviewPage />} />
        <Route path="/downloads" element={<DownloadsPage />} />
        <Route path="/billing" element={<BillingPage />} />
        <Route path="/credits" element={<CreditsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/logs" element={<AdminLogs />} />
        <Route path="/admin/payments" element={<AdminPayments />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
