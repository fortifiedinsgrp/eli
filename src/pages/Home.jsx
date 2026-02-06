import { Link } from 'react-router-dom'
import { 
  MessageSquare, CheckSquare, FileText, Calendar,
  ArrowRight, TrendingUp, Clock
} from 'lucide-react'

export default function Home() {
  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Good evening, Marc</h1>
        <p className="text-slate-400">Here's what's happening with your businesses.</p>
      </header>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <StatCard 
          label="Active Tasks" 
          value="12" 
          change="+3 today"
          icon={CheckSquare}
          color="blue"
        />
        <StatCard 
          label="Notes" 
          value="24" 
          change="2 new"
          icon={FileText}
          color="purple"
        />
        <StatCard 
          label="Messages" 
          value="156" 
          change="This week"
          icon={MessageSquare}
          color="green"
        />
        <StatCard 
          label="Completed" 
          value="89" 
          change="This month"
          icon={TrendingUp}
          color="amber"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="col-span-2 card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <Link to="/history" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-3">
            <ActivityItem 
              title="Completed task: Review Formulyt contracts"
              time="2 hours ago"
              type="task"
            />
            <ActivityItem 
              title="Added note: Meeting with Premier TPA"
              time="4 hours ago"
              type="note"
            />
            <ActivityItem 
              title="Chat: Discussed InstaQuote call center metrics"
              time="Yesterday"
              type="chat"
            />
            <ActivityItem 
              title="Completed task: Update Sentinel pricing"
              time="Yesterday"
              type="task"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Link to="/chat" className="btn-primary w-full flex items-center justify-center gap-2">
                <MessageSquare className="w-4 h-4" /> Chat with Eli
              </Link>
              <Link to="/tasks" className="btn-secondary w-full flex items-center justify-center gap-2">
                <CheckSquare className="w-4 h-4" /> Add Task
              </Link>
            </div>
          </div>

          {/* Latest Digest */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Latest Digest</h2>
              <Link to="/digests" className="text-blue-400 hover:text-blue-300 text-sm">
                All digests
              </Link>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg">
              <Calendar className="w-8 h-8 text-amber-400" />
              <div>
                <p className="font-medium">February 5, 2026</p>
                <p className="text-sm text-slate-400">7 items covered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, change, icon: Icon, color }) {
  const colors = {
    blue: 'from-blue-500/20 to-blue-600/5 text-blue-400',
    purple: 'from-purple-500/20 to-purple-600/5 text-purple-400',
    green: 'from-green-500/20 to-green-600/5 text-green-400',
    amber: 'from-amber-500/20 to-amber-600/5 text-amber-400',
  }

  return (
    <div className="card !p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${colors[color]} flex items-center justify-center`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-slate-500 mt-1">{change}</p>
    </div>
  )
}

function ActivityItem({ title, time, type }) {
  const icons = {
    task: <CheckSquare className="w-4 h-4 text-green-400" />,
    note: <FileText className="w-4 h-4 text-purple-400" />,
    chat: <MessageSquare className="w-4 h-4 text-blue-400" />,
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
      {icons[type]}
      <div className="flex-1">
        <p className="text-sm">{title}</p>
        <p className="text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {time}
        </p>
      </div>
    </div>
  )
}
