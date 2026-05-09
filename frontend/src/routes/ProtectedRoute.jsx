import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Loader2 } from 'lucide-react'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="mt-4 text-slate-500 font-medium">Authenticating...</p>
      </div>
    )
  }

  if (!user && !localStorage.getItem('token')) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
