import { useState } from 'react'
import { Plus, MoreHorizontal, Clock, Tag } from 'lucide-react'

const initialColumns = {
  todo: {
    title: 'To Do',
    color: 'slate',
    tasks: [
      { id: 1, title: 'Review Formulyt subscription metrics', priority: 'high', company: 'Formulyt', dueDate: 'Today' },
      { id: 2, title: 'Update InstaQuote call scripts', priority: 'medium', company: 'InstaQuote', dueDate: 'Tomorrow' },
    ]
  },
  inProgress: {
    title: 'In Progress',
    color: 'blue',
    tasks: [
      { id: 3, title: 'Build trading algorithm MVP', priority: 'high', company: 'Personal', dueDate: 'Feb 15' },
      { id: 4, title: 'Analyze Sentinel TPA data', priority: 'medium', company: 'Sentinel', dueDate: 'Feb 10' },
    ]
  },
  waiting: {
    title: 'Waiting',
    color: 'amber',
    tasks: [
      { id: 5, title: 'Premier TPA contract review', priority: 'high', company: 'My True Meds', dueDate: 'Feb 8' },
    ]
  },
  done: {
    title: 'Done',
    color: 'green',
    tasks: [
      { id: 6, title: 'Set up Eli dashboard repo', priority: 'medium', company: 'Personal', dueDate: 'Completed' },
    ]
  }
}

export default function Tasks() {
  const [columns, setColumns] = useState(initialColumns)

  return (
    <div className="p-8 h-full flex flex-col">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Tasks</h1>
          <p className="text-slate-400">Manage and track your work across all companies</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Task
        </button>
      </header>

      {/* Kanban Board */}
      <div className="flex-1 flex gap-4 overflow-x-auto pb-4">
        {Object.entries(columns).map(([columnId, column]) => (
          <KanbanColumn 
            key={columnId} 
            column={column} 
            columnId={columnId}
          />
        ))}
      </div>
    </div>
  )
}

function KanbanColumn({ column, columnId }) {
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
        <span className="text-slate-500 text-sm">({column.tasks.length})</span>
      </div>

      {/* Tasks */}
      <div className="flex-1 bg-slate-900/50 rounded-xl p-2 space-y-2 overflow-y-auto">
        {column.tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
        
        {/* Add task button */}
        <button className="w-full p-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:border-slate-600 hover:text-slate-400 transition-colors flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> Add task
        </button>
      </div>
    </div>
  )
}

function TaskCard({ task }) {
  const priorityColors = {
    high: 'bg-red-500/20 text-red-400',
    medium: 'bg-amber-500/20 text-amber-400',
    low: 'bg-green-500/20 text-green-400',
  }

  return (
    <div className="bg-slate-800 rounded-lg p-3 cursor-pointer hover:bg-slate-750 transition-colors group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-medium text-sm leading-tight">{task.title}</h3>
        <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs px-2 py-0.5 rounded ${priorityColors[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 flex items-center gap-1">
          <Tag className="w-3 h-3" /> {task.company}
        </span>
      </div>
      
      <div className="flex items-center gap-1 mt-2 text-xs text-slate-500">
        <Clock className="w-3 h-3" />
        {task.dueDate}
      </div>
    </div>
  )
}
