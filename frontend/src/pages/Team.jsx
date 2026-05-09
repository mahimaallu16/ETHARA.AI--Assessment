import { useQuery } from '@tanstack/react-query'
import { Users, Mail, Shield, Search, Loader2 } from 'lucide-react'
import api from '../utils/api'

export default function Team() {
  const { data: team, isLoading } = useQuery({
    queryKey: ['team'],
    queryFn: async () => {
      // In a real app, you'd have a specific endpoint for team members
      // For now, we'll simulate it by getting the current user's profile
      // or a general user list if admin.
      const response = await api.get('/auth/me')
      return [response.data] // Just showing the current user as a team member for now
    }
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Team Members</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your team and their access levels.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Filter members..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
            />
          </div>
          <button className="btn btn-primary text-sm">Invite Member</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : team?.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-sm">
                        {member.full_name?.charAt(0)}
                      </div>
                      <span className="font-semibold text-slate-900">{member.full_name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-sm capitalize">{member.role?.replace('_', ' ')}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-500">
                      <Mail className="w-3.5 h-3.5" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-slate-400 hover:text-slate-600 text-sm font-medium">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
