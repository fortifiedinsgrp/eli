import { CheckSquare, FileText, MessageSquare, Clock, Filter } from 'lucide-react'

const historyItems = [
  { id: 1, type: 'task', title: 'Set up Eli dashboard repository', description: 'Created fortifiedinsgrp/eli on GitHub', time: 'Just now', date: 'Feb 5, 2026' },
  { id: 2, type: 'chat', title: 'LifeOS API integration', description: 'Connected to Captain\'s Log CRM via service account', time: '30 min ago', date: 'Feb 5, 2026' },
  { id: 3, type: 'task', title: 'Google Chat channel setup', description: 'Configured webhook and service account', time: '2 hours ago', date: 'Feb 5, 2026' },
  { id: 4, type: 'note', title: 'Business structure documented', description: 'Captured all companies and their relationships in USER.md', time: '3 hours ago', date: 'Feb 5, 2026' },
  { id: 5, type: 'task', title: 'OpenClaw installation', description: 'Third time\'s the charm - full setup complete', time: '4 hours ago', date: 'Feb 5, 2026' },
]

export default function History() {
  return (
    <div className="p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-slate-400">Everything I've worked on</p>
        </div>
        <button className="btn-secondary flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter
        </button>
      </header>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-slate-800" />

        <div className="space-y-6">
          {historyItems.map((item, index) => (
            <HistoryItem key={item.id} item={item} isFirst={index === 0} />
          ))}
        </div>
      </div>
    </div>
  )
}

function HistoryItem({ item, isFirst }) {
  const icons = {
    task: <CheckSquare className="w-4 h-4" />,
    note: <FileText className="w-4 h-4" />,
    chat: <MessageSquare className="w-4 h-4" />,
  }

  const colors = {
    task: 'bg-green-500/20 text-green-400 border-green-500/30',
    note: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    chat: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  }

  return (
    <div className="flex gap-4 relative">
      {/* Icon */}
      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center z-10 ${colors[item.type]}`}>
        {icons[item.type]}
      </div>

      {/* Content */}
      <div className="flex-1 card !p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-slate-400 mt-1">{item.description}</p>
          </div>
          <div className="text-right text-sm">
            <p className="text-slate-400">{item.time}</p>
            <p className="text-slate-500 text-xs">{item.date}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
