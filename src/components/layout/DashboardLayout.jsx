import React from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { useQuery } from '@tanstack/react-query'
import { getCredits } from '../../services/supabase.service'
import { 
  LayoutDashboard, 
  UploadCloud, 
  Download, 
  CreditCard, 
  Coins, 
  Settings, 
  LogOut, 
  Scissors, 
  ShieldAlert,
  User
} from 'lucide-react'

export default function DashboardLayout() {
  const { user, profile, signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const { data: credits } = useQuery({
    queryKey: ['credits', user?.id],
    queryFn: () => getCredits(user.id),
    enabled: !!user?.id,
    refetchInterval: 10000 // poll every 10s to reflect Razorpay updates quickly
  })

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const navItems = [
    { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Upload Workspace', path: '/upload', icon: UploadCloud },
    { label: 'Download History', path: '/downloads', icon: Download },
    { label: 'Billing & Plan', path: '/billing', icon: CreditCard },
    { label: 'Buy Credits', path: '/credits', icon: Coins },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r p-4 justify-between sticky top-0 h-screen" style={{ borderColor: 'var(--card-border)', background: 'var(--bg-secondary)' }}>
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2.5 font-bold text-xl px-2 text-white group">
            <span className="p-2 rounded-xl bg-gradient-primary shadow-glow-sm group-hover:scale-105 transition-transform duration-300">
              <Scissors className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading">SnapCut <span className="gradient-text">AI</span></span>
          </Link>

          {/* Quick Stats / Credits card */}
          <div className="card p-4 flex flex-col gap-2">
            <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">Quota Remaining</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold" style={{ color: 'var(--primary)' }}>
                {credits ? (credits.plan === 'pro' ? '∞' : (credits.total_credits - credits.used_credits)) : '...'}
              </span>
              <span className="text-xs text-text-muted">
                {credits?.plan === 'pro' ? 'unlimited' : `/ ${credits?.total_credits || 5} daily`}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full overflow-hidden mt-1" style={{ background: '#1a1a1a' }}>
              {credits && credits.plan !== 'pro' && (
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, (credits.used_credits / credits.total_credits) * 100)}%`,
                    background: 'linear-gradient(90deg, var(--primary), var(--primary-hover))'
                  }}
                />
              )}
              {credits?.plan === 'pro' && (
                <div className="h-full rounded-full w-full" style={{ background: 'var(--success)' }} />
              )}
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive 
                      ? 'text-white border' 
                      : 'text-text-muted hover:text-white border border-transparent'
                  }`}
                  style={isActive ? { 
                    background: 'rgba(245, 158, 11, 0.1)', 
                    borderColor: 'rgba(245, 158, 11, 0.25)',
                    color: 'var(--primary-hover)'
                  } : {}}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          {profile?.role === 'admin' && (
            <Link 
              to="/admin" 
              className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-glow-sm"
              style={{ color: 'var(--warning)', borderStyle: 'dashed', borderWidth: '1px', borderColor: 'rgba(251, 191, 36, 0.2)' }}
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Panel
            </Link>
          )}

          <div className="divider" />
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--card-border)' }}>
                <User className="h-4 w-4 text-text-muted" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                  {profile?.full_name || user?.raw_user_meta_data?.full_name || user?.email || 'User'}
                </span>
                <span className="text-[10px] text-text-muted capitalize">{credits?.plan || 'Free'} Plan</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-text-muted hover:text-error rounded-lg transition-colors"
              title="Logout"
              id="sidebar-logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 border-b px-4 flex items-center justify-between sticky top-0 z-30 backdrop-blur-xl" style={{ borderColor: 'var(--card-border)', background: 'rgba(23, 23, 23, 0.85)' }}>
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <span className="p-1.5 rounded-lg bg-gradient-primary">
              <Scissors className="h-4 w-4 text-white" />
            </span>
            <span className="font-heading">SnapCut</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/upload" className="btn-primary py-1.5 px-3 text-xs">
              Upload
            </Link>
            <button onClick={handleLogout} className="p-2 text-text-muted hover:text-white transition-colors" id="mobile-logout">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 z-30 flex items-center justify-around px-2 backdrop-blur-xl" style={{ borderTop: '1px solid var(--card-border)', background: 'rgba(23, 23, 23, 0.92)' }}>
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary-hover' : 'text-text-muted'}`}>
          <LayoutDashboard className="h-5 w-5" /> Overview
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary-hover' : 'text-text-muted'}`}>
          <UploadCloud className="h-5 w-5" /> Upload
        </NavLink>
        <NavLink to="/downloads" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary-hover' : 'text-text-muted'}`}>
          <Download className="h-5 w-5" /> History
        </NavLink>
        <NavLink to="/billing" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary-hover' : 'text-text-muted'}`}>
          <CreditCard className="h-5 w-5" /> Plans
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${isActive ? 'text-primary-hover' : 'text-text-muted'}`}>
          <Settings className="h-5 w-5" /> Account
        </NavLink>
      </nav>
    </div>
  )
}
