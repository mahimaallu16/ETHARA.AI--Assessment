import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Calendar,
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  Filter
} from 'lucide-react'
import api from '../utils/api'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { clsx } from 'clsx'

const STATUS_COLUMNS = [
  { id: 'todo', title: 'To Do', icon: Clock, color: 'text-slate-500', bg: 'bg-slate-50' },
  { id: 'in_progress', title: 'In Progress', icon: Clock, color: 'text-blue-500', bg: 'bg-blue-50' },
  { id: 'review', title: 'Review', icon: AlertCircle, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 'completed', title: 'Completed', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
]

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [taskTitle, setTaskTitle] = useState('')
  const [taskDesc, setTaskDesc] = useState('')
  const queryClient = useQueryClient()

  const generateAIContent = async () => {
    if (!taskTitle) {
      toast.error('Please enter a task title first')
      return
    }
    setIsGenerating(true)
    try {
      const response = await api.post('/ai/generate-description', { title: taskTitle })
      setTaskDesc(response.data.description)
      toast.success('AI description generated!')
    } catch (error) {
      toast.error('AI generation failed')
    } finally {
      setIsGenerating(false)
    }
  }

  const { data: tasks, isLoading: isTasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await api.get('/tasks/')
      return response.data
    }
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await api.get('/projects/')
      return response.data
    }
  })

  const updateTaskStatus = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/tasks/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      toast.success('Task status updated')
    }
  })

  const createTask = useMutation({
    mutationFn: (newTask) => api.post('/tasks/', newTask),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks'])
      setIsModalOpen(false)
      toast.success('Task created successfully')
    }
  })

  const filteredTasks = tasks?.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tasksByStatus = (status) => filteredTasks?.filter(t => t.status === status) || []

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Task Board</h1>
          <p className="text-slate-500 text-sm mt-1">Manage and organize your tasks across projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {isTasksLoading ? (
        <div className="flex flex-col items-center justify-center py-24">
          <Loader2 className="w-10 h-10 text-primary-600 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-start overflow-x-auto pb-4">
          {STATUS_COLUMNS.map((column) => (
            <div key={column.id} className="min-w-[280px] space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900">{column.title}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold">
                    {tasksByStatus(column.id).length}
                  </span>
                </div>
                <button className="text-slate-400 hover:text-slate-600">
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className={clsx("p-2 rounded-xl min-h-[500px] transition-colors", column.bg)}>
                <AnimatePresence mode="popLayout">
                  {tasksByStatus(column.id).map((task) => (
                    <motion.div
                      key={task.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="card p-4 mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <span className={clsx(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                          task.priority === 'urgent' ? "bg-rose-50 text-rose-700" :
                          task.priority === 'high' ? "bg-amber-50 text-amber-700" :
                          "bg-blue-50 text-blue-700"
                        )}>
                          {task.priority}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => {
                              const nextStatus = column.id === 'todo' ? 'in_progress' : 
                                               column.id === 'in_progress' ? 'review' : 
                                               column.id === 'review' ? 'completed' : 'todo'
                              updateTaskStatus.mutate({ id: task.id, status: nextStatus })
                            }}
                            className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-primary-600"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      
                      <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary-600 transition-colors">
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-2">
                        {task.description || "No description provided."}
                      </p>

                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                        <div className="flex items-center text-[10px] font-medium text-slate-400">
                          <Calendar className="w-3 h-3 mr-1" />
                          {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'No date'}
                        </div>
                        <div className="w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center text-[10px] font-bold text-primary-600">
                          {task.assignee?.full_name?.charAt(0) || 'U'}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {tasksByStatus(column.id).length === 0 && (
                  <div className="flex flex-col items-center justify-center py-8 opacity-40">
                    <p className="text-xs font-medium text-slate-400">No tasks here</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
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
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create New Task</h2>
              <form 
                onSubmit={(e) => {
                  e.preventDefault()
                  createTask.mutate({
                    title: taskTitle,
                    description: taskDesc,
                    project_id: parseInt(e.target.project_id.value),
                    priority: e.target.priority.value,
                    status: 'todo'
                  })
                }}
                className="space-y-5"
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Task Title</label>
                  <input
                    name="title"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    placeholder="e.g., Design Landing Page"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Project</label>
                  <select
                    name="project_id"
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                  >
                    <option value="">Select a project</option>
                    {projects?.map(p => (
                      <option key={p.id} value={p.id}>{p.title}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Priority</label>
                    <select
                      name="priority"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all appearance-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Due Date</label>
                    <input
                      name="due_date"
                      type="date"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium text-slate-700">Description</label>
                    <button
                      type="button"
                      onClick={generateAIContent}
                      disabled={isGenerating || !taskTitle}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-primary-600 uppercase tracking-wider hover:text-primary-700 disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                      Generate with AI
                    </button>
                  </div>
                  <textarea
                    name="description"
                    rows={3}
                    value={taskDesc}
                    onChange={(e) => setTaskDesc(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all resize-none"
                    placeholder="Describe the task details..."
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
                    disabled={createTask.isPending}
                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm disabled:opacity-70"
                  >
                    {createTask.isPending ? 'Creating...' : 'Create Task'}
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

// Helper component for status transitions
function ArrowRight({ className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
