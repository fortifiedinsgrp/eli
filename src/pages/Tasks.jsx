import { useState } from 'react'
import { Plus, MoreHorizontal, Clock, Tag, Loader2, X } from 'lucide-react'
import { useTasks, useCompanies, useCreateTask, useUpdateTask, useCompleteTask } from '../lib/hooks'

const STATUS_COLUMNS = {
  TODO: { title: 'To Do', color: 'slate' },
  IN_PROGRESS: { title: 'In Progress', color: 'blue' },
  WAITING: { title: 'Waiting', color: 'amber' },
  DONE: { title: 'Done', color: 'green' },
}

export default function Tasks() {
  const [showAddModal, setShowAddModal] = useState(false)
  const { data: tasksData, isLoading } = useTasks({ includeCompleted: true, limit: 100 })
  const { data: companiesData } = useCompanies()

  const tasks = tasksData?.tasks || []
  const companies = companiesData?.companies || []

  // Group tasks by status
  const tasksByStatus = {
    TODO: tasks.filter(t => t.status === 'TODO'),
    IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
    WAITING: tasks.filter(t => t.status === 'WAITING'),
    DONE: tasks.filter(t => t.status === 'DONE'),
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-slate-400">Manage and track your work across all companies</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {Object.entries(STATUS_COLUMNS).map(([status, column]) => (
          <KanbanColumn 
            key={status} 
            column={column}
            status={status}
            tasks={tasksByStatus[status] || []}
            companies={companies}
            onAddTask={() => setShowAddModal(true)}
          />
        ))}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <AddTaskModal 
          companies={companies}
          onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  )
}

function KanbanColumn({ column, status, tasks, companies, onAddTask }) {
  const colorClasses = {
    slate: 'bg-slate-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    green: 'bg-green-500',
  }

  return (
    <div className="w-80 flex-shrink-0 flex flex-col">
      {/* Column Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-3 h-3 rounded-full ${colorClasses[column.color]}`} />
        <h2 className="font-semibold">{column.title}</h2>
        <span className="text-slate-500 text-sm">({tasks.length})</span>
      </div>

      {/* Tasks */}
      <div className="flex-1 bg-slate-900/50 rounded-xl p-2 space-y-2 overflow-y-auto">
        {tasks.map(task => (
          <TaskCard 
            key={task.id} 
            task={task} 
            companies={companies}
          />
        ))}
        
        {/* Add task button */}
        <button 
          onClick={onAddTask}
          className="w-full p-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-slate-600 hover:text-slate-400 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add task
        </button>
      </div>
    </div>
  )
}

function TaskCard({ task, companies }) {
  const updateTask = useUpdateTask()
  const completeTask = useCompleteTask()
  
  const company = companies.find(c => c.id === task.companyId)
  
  const priorityColors = {
    HIGH: 'bg-red-500/20 text-red-400',
    MEDIUM: 'bg-amber-500/20 text-amber-400',
    LOW: 'bg-green-500/20 text-green-400',
  }

  const handleStatusChange = (newStatus) => {
    if (newStatus === 'DONE') {
      completeTask.mutate(task.id)
    } else {
      updateTask.mutate({ id: task.id, updates: { status: newStatus } })
    }
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return null
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="bg-slate-800 rounded-lg p-3 cursor-pointer hover:bg-slate-750 transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
        <div className="relative">
          <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-slate-400 mb-2 line-clamp-2">{task.description}</p>
      )}
      
      <div className="flex items-center gap-2 flex-wrap">
        {task.priority && (
          <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority] || priorityColors.MEDIUM}`}>
            {task.priority.toLowerCase()}
          </span>
        )}
        {company && (
          <span 
            className="text-xs px-2 py-0.5 rounded text-slate-300 flex items-center gap-1"
            style={{ backgroundColor: company.color + '33' }}
          >
            <Tag className="w-3 h-3" /> {company.name}
          </span>
        )}
      </div>
      
      {task.dueDate && (
        <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
          <Clock className="w-3 h-3" />
          {formatDate(task.dueDate)}
        </div>
      )}
    </div>
  )
}

function AddTaskModal({ companies, onClose }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [companyId, setCompanyId] = useState('')
  const [status, setStatus] = useState('TODO')
  
  const createTask = useCreateTask()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return
    
    createTask.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      companyId: companyId || undefined,
      status,
    }, {
      onSuccess: () => onClose()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-md border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Add Task</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Task title..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20 resize-none"
              placeholder="Optional description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="WAITING">Waiting</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company</label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">No company</option>
              {companies.map(company => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!title.trim() || createTask.isPending}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {createTask.isPending ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
