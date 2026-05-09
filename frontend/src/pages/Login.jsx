import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Sparkles, Mail, Lock, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Login() {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', data.email)
      formData.append('password', data.password)

      const response = await axios.post('/api/v1/auth/login', formData)
      localStorage.setItem('token', response.data.access_token)
      toast.success('Welcome back to TaskMind!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side: Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-primary-600 p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tight">TaskMind AI</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-5xl font-bold leading-tight">
            Manage projects with <br />
            <span className="text-primary-200">AI Intelligence.</span>
          </h1>
          <p className="text-primary-100 text-lg max-w-md">
            The modern platform for teams to collaborate, track progress, and boost productivity with AI-driven insights.
          </p>
        </div>

        <div className="flex items-center gap-4 text-primary-200">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-primary-600 bg-primary-400" />
            ))}
          </div>
          <span className="text-sm">Joined by 10,000+ teams</span>
        </div>
      </div>

      {/* Right side: Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-slate-500">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('email')}
                  type="email"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                    errors.email ? 'border-red-500' : 'border-slate-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                  placeholder="name@company.com"
                />
              </div>
              {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-slate-700">Password</label>
                <Link to="/forgot-password" title="Coming Soon" className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  {...register('password')}
                  type="password"
                  className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${
                    errors.password ? 'border-red-500' : 'border-slate-200'
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
            </div>

            <button
              disabled={isLoading}
              className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign in
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
