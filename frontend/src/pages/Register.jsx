import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Sparkles, Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react'
import toast from 'react-hot-toast'
import axios from 'axios'

const registerSchema = z.object({
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['admin', 'manager', 'team_member']).default('team_member'),
})

export default function Register() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data) => {
        setIsLoading(true)
        try {
            await axios.post('/api/v1/auth/register', data)
            toast.success('Account created successfully! Please log in.')
            navigate('/login')
        } catch (error) {
            toast.error(error.response?.data?.detail || 'Something went wrong. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex flex-col md:flex-row bg-white">
            {/* Left side: Hero Section */}
            <div className="hidden md:flex md:w-1/2 bg-slate-900 p-12 flex-col justify-between text-white">
                <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold tracking-tight">TaskMind AI</span>
                </div>

                <div className="space-y-6">
                    <h1 className="text-5xl font-bold leading-tight">
                        Start your journey <br />
                        <span className="text-primary-500">with precision.</span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-md">
                        Join thousands of teams using AI to streamline their workflow and hit their goals faster.
                    </p>
                </div>

                <div className="p-6 bg-slate-800 rounded-2xl border border-slate-700">
                    <p className="text-sm italic text-slate-300">
                        "TaskMind AI transformed how our engineering team operates. The AI summaries save us hours every week."
                    </p>
                    <div className="mt-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-600" />
                        <div>
                            <p className="text-sm font-semibold">David Chen</p>
                            <p className="text-xs text-slate-500">CTO at TechFlow</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side: Register Form */}
            <div className="flex-1 flex flex-col justify-center items-center px-6 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-3xl font-bold text-slate-900">Create account</h2>
                        <p className="mt-2 text-slate-500">Get started with your free workspace today</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Full Name</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...register('full_name')}
                                    type="text"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.full_name ? 'border-red-500' : 'border-slate-200'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                                    placeholder="John Doe"
                                />
                            </div>
                            {errors.full_name && <p className="text-xs text-red-500 ml-1">{errors.full_name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Email Address</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...register('email')}
                                    type="email"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.email ? 'border-red-500' : 'border-slate-200'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                                    placeholder="name@company.com"
                                />
                            </div>
                            {errors.email && <p className="text-xs text-red-500 ml-1">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    {...register('password')}
                                    type="password"
                                    className={`w-full pl-10 pr-4 py-3 bg-slate-50 border ${errors.password ? 'border-red-500' : 'border-slate-200'
                                        } rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-xs text-red-500 ml-1">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700 ml-1">Role</label>
                            <select
                                {...register('role')}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                            >
                                <option value="team_member">Team Member</option>
                                <option value="manager">Manager</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 focus:ring-4 focus:ring-primary-500/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-sm text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
