import { useState, useRef, useEffect } from 'react'
import { Search, Bell, User, LogOut, Settings as SettingsIcon, ChevronDown } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-20">
      <div className="flex-1 max-w-xl">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary-500" />
          <input
            type="text"
            placeholder="Search projects, tasks, members..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200 mx-2"></div>

        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-3 pl-2 hover:bg-slate-50 p-1.5 rounded-xl transition-all"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-none">{user?.full_name || 'User'}</p>
              <p className="text-[10px] font-medium text-slate-500 mt-1 capitalize tracking-wide">{user?.role?.replace('_', ' ') || 'Team Member'}</p>
            </div>
            <div className="w-9 h-9 bg-indigo-100 border border-indigo-200 rounded-full flex items-center justify-center overflow-hidden text-indigo-600">
              <User className="w-5 h-5" />
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 z-30 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-3 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-900">{user?.full_name}</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
              
              <div className="p-2">
                <Link 
                  to="/settings" 
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                >
                  <SettingsIcon className="w-4 h-4" />
                  Account Settings
                </Link>
                <button 
                  onClick={() => {
                    setIsProfileOpen(false)
                    logout()
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
