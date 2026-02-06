import { Link } from 'react-router-dom'
import { Plus, Calendar, ChevronRight, CheckSquare, AlertCircle, TrendingUp } from 'lucide-react'

const digests = [
  { 
    id: '2026-02-05',
    date: 'February 5, 2026',
    day: 'Wednesday',
    summary: 'Setup day - Got OpenClaw running, connected to LifeOS, started building the dashboard.',
    highlights: [
      'OpenClaw installation complete',
      'Google Chat channel configured',
      'LifeOS API integrated',
      'Dashboard repo created'
    ],
    tasksCompleted: 4,
    alerts: 0
  },
]

export default function Digests() {
  return (
    <div className="p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Digests</h1>
          <p className="text-slate-400">Daily summaries of activity and progress</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Generate Today's Digest
        </button>
      </header>

      {/* Digests List */}
      <div className="space-y-4">
        {digests.map(digest => (
          <DigestCard key={digest.id} digest={digest} />
        ))}
        
        {/* Empty state for future dates */}
        <div className="card !p-8 text-center text-slate-500">
          <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>More digests will appear as you use Eli</p>
          <p className="text-sm mt-1">Each day gets a summary of activity and progress</p>
        </div>
      </div>
    </div>
  )
}

function DigestCard({ digest }) {
  return (
    <Link to={`/digests/${digest.id}`} className="card block hover:border-slate-700 transition-colors group">
      <div className="flex items-start gap-4">
        {/* Date */}
        <div className="w-16 h-16 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex flex-col items-center justify-center">
          <Calendar className="w-6 h-6 text-amber-400" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold group-hover:text-blue-400 transition-colors">{digest.date}</h3>
            <span className="text-sm text-slate-500">{digest.day}</span>
          </div>
          <p className="text-slate-400 text-sm mb-3">{digest.summary}</p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-green-400">
              <CheckSquare className="w-4 h-4" />
              {digest.tasksCompleted} tasks completed
            </span>
            {digest.alerts > 0 && (
              <span className="flex items-center gap-1 text-amber-400">
                <AlertCircle className="w-4 h-4" />
                {digest.alerts} alerts
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-500">
              <TrendingUp className="w-4 h-4" />
              {digest.highlights.length} highlights
            </span>
          </div>
        </div>

        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-slate-500 group-hover:text-slate-300 transition-colors" />
      </div>
    </Link>
  )
}
