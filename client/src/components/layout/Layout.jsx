import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  LayoutDashboard, FolderKanban, CheckSquare,
  LogOut, Zap, Menu, X,
} from 'lucide-react'
import { useState } from 'react'
import { logout } from '../../features/auth/authSlice'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'All Tasks' },
]

export default function Layout() {
  const [open, setOpen] = useState(false)
  const { user } = useSelector((s) => s.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/')
  }

  const initials = user?.userName?.slice(0, 2).toUpperCase() || 'TF'

  return (
    <div className="flex h-screen bg-ink-950 overflow-hidden">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-30
          w-64 flex flex-col
          bg-ink-900/80 backdrop-blur-xl
          border-r border-white/6
          transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-6 border-b border-white/6">
          <div className="w-8 h-8 bg-volt-500 rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-ink-950" strokeWidth={2.5} />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">TaskFlow</span>
          <button className="ml-auto lg:hidden text-white/40 hover:text-white" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          <p className="section-title px-3 mb-3 mt-2">Navigation</p>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setOpen(false)}
            >
              <Icon size={17} strokeWidth={2} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-white/6 space-y-1">
          {/* Profile link */}
          <NavLink
            to="/profile"
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            <div className="w-7 h-7 rounded-lg bg-volt-500/20 border border-volt-500/30 flex items-center justify-center text-volt-400 text-xs font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate leading-tight">{user?.userName}</p>
              <p className="text-xs text-white/30 truncate leading-tight">{user?.email}</p>
            </div>
          </NavLink>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="sidebar-link w-full text-left text-red-400/60 hover:text-red-400 hover:bg-red-500/5"
          >
            <LogOut size={17} strokeWidth={2} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-4 px-4 py-4 border-b border-white/6 bg-ink-900/60 backdrop-blur">
          <button onClick={() => setOpen(true)} className="text-white/60 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-volt-500 rounded-md flex items-center justify-center">
              <Zap size={12} className="text-ink-950" />
            </div>
            <span className="font-bold text-white">TaskFlow</span>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
