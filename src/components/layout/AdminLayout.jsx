import React from 'react'
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  FileTerminal, 
  CreditCard,
  ArrowLeft,
  LogOut
} from 'lucide-react'

export default function AdminLayout() {
  const { signOut } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const adminNavItems = [
    { label: 'Overview', path: '/admin', icon: ShieldCheck },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Usage Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Workflow Logs', path: '/admin/logs', icon: FileTerminal },
    { label: 'Payment Records', path: '/admin/payments', icon: CreditCard },
  ]

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <aside className="w-64 border-r border-card-border bg-background-secondary p-4 flex flex-col justify-between sticky top-0 h-screen">
        <div className="flex flex-col gap-6">
          <div>
            <Link to="/dashboard" className="flex items-center gap-2 text-xs text-text-muted hover:text-white transition-colors mb-4">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to App
            </Link>
            <div className="flex items-center gap-2 font-bold text-lg text-warning px-2">
              <ShieldCheck className="h-5 w-5 text-warning" />
              <span>Admin Console</span>
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-warning/10 text-warning border border-warning/20' 
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

        <button 
          onClick={async () => { await signOut(); navigate('/'); }}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/5 transition-colors border border-transparent"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </aside>

      {/* Content wrapper */}
      <div className="flex-1 flex flex-col min-h-screen">
        <main className="flex-1 p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
