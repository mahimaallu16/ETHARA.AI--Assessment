import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Briefcase, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut,
  Sparkles
} from 'lucide-react'
import { clsx } from 'clsx'
import { useAuth } from '../context/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Tasks', href: '/tasks', icon: CheckSquare },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'AI Assistant', href: '/ai-tools', icon: Sparkles },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export default function Sidebar() {
  const { logout } = useAuth()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-slate-200 h-screen sticky top-0">
      <div className="flex items-center gap-2 px-6 h-16 border-b border-slate-100">
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
          TaskMind AI
        </span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}
