import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import api from '../utils/api'
import { useAuth } from '../context/AuthContext'
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  User,
  Loader2
} from 'lucide-react'
import { clsx } from 'clsx'
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'

export default function Dashboard() {
  const { user } = useAuth()
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await api.get('/dashboard/stats')
      return response.data
    }
  })

  const statCards = [
    { label: 'Total Projects', value: stats?.total_projects || 0, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Completed Tasks', value: stats?.completed_tasks || 0, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Pending Tasks', value: stats?.pending_tasks || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Productivity', value: `${stats?.productivity_score || 0}%`, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ]

  const chartData = [
    { name: 'Mon', tasks: 12 },
    { name: 'Tue', tasks: 19 },
    { name: 'Wed', tasks: 15 },
    { name: 'Thu', tasks: 22 },
    { name: 'Fri', tasks: 30 },
    { name: 'Sat', tasks: 10 },
    { name: 'Sun', tasks: 8 },
  ]

  const recentActivity = [
    { id: 1, user: 'Sarah Chen', action: 'completed', target: 'Update Dashboard UI', time: '2h ago' },
    { id: 2, user: 'Mike Ross', action: 'added a comment to', target: 'API Integration', time: '4h ago' },
    { id: 3, user: user?.full_name || 'Alex Rivera', action: 'created', target: 'Q3 Strategy Project', time: '5h ago' },
    { id: 4, user: 'Sarah Chen', action: 'reassigned', target: 'Database Migration', time: 'Yesterday' },
  ]

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        <p className="mt-4 text-slate-500">Loading dashboard data...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.full_name?.split(' ')[0] || 'User'}</h1>
          <p className="text-slate-500">Here's what's happening with your projects today.</p>
        </div>
        <button className="btn btn-primary">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card p-6"
          >
            <div className="flex items-start justify-between">
              <div className={clsx("p-2 rounded-lg", stat.bg)}>
                <stat.icon className={clsx("w-6 h-6", stat.color)} />
              </div>
              <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                +12% <ArrowUpRight className="w-3 h-3 ml-0.5" />
              </span>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-slate-500">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Team Productivity</h3>
            <select className="text-sm border-none bg-slate-50 rounded-lg px-2 py-1 focus:ring-0">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: 'none', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#0ea5e9" strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold text-slate-900">{activity.user}</span> {activity.action} <span className="font-medium text-slate-900">{activity.target}</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
            View all activity
          </button>
        </div>
      </div>
    </div>
  )
}
