import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Briefcase, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Calendar,
  Users,
  LayoutGrid,
  List as ListIcon,
  Loader2
} from 'lucide-react'
import api from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

export default function Projects() {
  const [view, setView] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects/')
      return response.data
    }
  })

  const createProject = useMutation({
    mutationFn: (newProject) => api.post('/projects/', newProject),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      setIsModalOpen(false)
      toast.success('Project created successfully!')
    },
    onError: (error) => {
      toast.error(error.response?.data?.detail || 'Failed to create project')
    }
  })

  const filteredProjects = projects?.filter(p => 
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Projects</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and track your team's initiatives.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <div className="flex items-center bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setView('grid')}
              className={clsx(
                "p-1.5 rounded-md transition-all",
                view === 'grid' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={clsx(
                "p-1.5 rounded-md transition-all",
                view === 'list' ? "bg-white text-primary-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
          <p className="mt-4 text-slate-500 animate-pulse">Loading your projects...</p>
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-2xl border-2 border-dashed border-slate-200">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No projects found</h3>
          <p className="text-slate-500 max-w-xs text-center mt-1">
            {searchQuery ? "Try adjusting your search filters." : "Create your first project to start tracking your work."}
          </p>
        </div>
      ) : (
        <div className={clsx(
          "grid gap-6",
          view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
          {filteredProjects?.map((project) => (
            <motion.div
              layout
              key={project.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card group cursor-pointer hover:border-primary-200 hover:shadow-premium transition-all duration-300"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className={clsx(
                    "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    project.status === 'active' ? "bg-emerald-50 text-emerald-700" :
                    project.status === 'planning' ? "bg-blue-50 text-blue-700" :
                    "bg-slate-50 text-slate-700"
                  )}>
                    {project.status}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-4 group-hover:text-primary-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                  {project.description || "No description provided."}
                </p>

                <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center text-slate-500 text-xs">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'No deadline'}
                    </div>
                    <div className="flex items-center text-slate-500 text-xs">
                      <Users className="w-3.5 h-3.5 mr-1.5" />
                      {project.members?.length || 0}
                    </div>
                  </div>
                  
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                        {i}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-premium p-8"
            >
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Project</h2>
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.target)
                  createProject.mutate({
                    title: formData.get('title'),
                    description: formData.get('description'),
                    status: 'active',
                  })
                }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Project Title</label>
                  <input
                    name="title"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    placeholder="e.g., Website Redesign 2024"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                    placeholder="Briefly describe the project goals..."
                  />
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border border-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createProject.isPending}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm disabled:opacity-70"
                  >
                    {createProject.isPending ? 'Creating...' : 'Create Project'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
