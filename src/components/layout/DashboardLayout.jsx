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
  Key, 
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
    { label: 'API Keys (B2B)', path: '/api-keys', icon: Key },
    { label: 'Settings', path: '/settings', icon: Settings },
  ]

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-card-border bg-background-secondary p-4 justify-between sticky top-0 h-screen">
        <div className="flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl px-2 text-white group">
            <span className="p-2 rounded bg-gradient-primary">
              <Scissors className="h-5 w-5 text-white" />
            </span>
            <span className="font-heading">SnapCut <span className="text-primary">AI</span></span>
          </Link>

          {/* Quick Stats / Credits card */}
          <div className="card p-4 bg-card border-card-border flex flex-col gap-2">
            <span className="text-xs text-text-muted">Quota Remaining</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-primary">
                {credits ? (credits.plan === 'pro' ? '∞' : (credits.total_credits - credits.used_credits)) : '...'}
              </span>
              <span className="text-xs text-text-muted">
                {credits?.plan === 'pro' ? 'unlimited' : `/ ${credits?.total_credits || 5} daily`}
              </span>
            </div>
            <div className="w-full bg-black-secondary h-1.5 rounded-full overflow-hidden mt-1 bg-black">
              {credits && credits.plan !== 'pro' && (
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (credits.used_credits / credits.total_credits) * 100)}%` }}
                />
              )}
              {credits?.plan === 'pro' && (
                <div className="bg-success h-full rounded-full w-full" />
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
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-primary/10 text-primary border border-primary/20' 
                      : 'text-text-secondary hover:bg-card hover:text-white border border-transparent'
                  }`}
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
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-semibold text-warning hover:bg-warning/5 transition-colors border border-dashed border-warning/20"
            >
              <ShieldAlert className="h-4 w-4" />
              Admin Panel
            </Link>
          )}

          <div className="divider" />
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-card flex items-center justify-center border border-card-border">
                <User className="h-4 w-4 text-text-secondary" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-white max-w-[120px] truncate">
                  {profile?.full_name || profile?.email || 'User'}
                </span>
                <span className="text-[10px] text-text-muted capitalize">{credits?.plan || 'Free'} Plan</span>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-1.5 text-text-muted hover:text-error hover:bg-error/5 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area with Header - Mobile/Tablet Nav */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header Nav */}
        <header className="lg:hidden h-16 border-b border-card-border bg-background-secondary px-4 flex items-center justify-between sticky top-0 z-30">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white">
            <Scissors className="h-5 w-5 text-primary" />
            <span className="font-heading">SnapCut</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/upload" className="btn-primary py-1.5 px-3 text-xs">
              Upload
            </Link>
            <button onClick={handleLogout} className="p-2 text-text-secondary hover:text-white">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Inner Outlet with Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Tab Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-background-secondary border-t border-card-border z-30 flex items-center justify-around px-2">
        <NavLink to="/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
          <LayoutDashboard className="h-5 w-5" /> Overview
        </NavLink>
        <NavLink to="/upload" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
          <UploadCloud className="h-5 w-5" /> Upload
        </NavLink>
        <NavLink to="/downloads" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
          <Download className="h-5 w-5" /> History
        </NavLink>
        <NavLink to="/billing" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
          <CreditCard className="h-5 w-5" /> Plans
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => `flex flex-col items-center gap-1 text-[10px] font-medium ${isActive ? 'text-primary' : 'text-text-muted'}`}>
          <Settings className="h-5 w-5" /> Account
        </NavLink>
      </nav>
    </div>
  )
}
