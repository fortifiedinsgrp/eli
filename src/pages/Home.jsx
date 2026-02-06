import { Link } from 'react-router-dom'
import { 
  MessageSquare, CheckSquare, FileText, Calendar,
  ArrowRight, TrendingUp, Clock, Building2, Loader2
} from 'lucide-react'
import { useTasks, useNotes, useCompanies } from '../lib/hooks'

export default function Home() {
  const { data: tasksData, isLoading: tasksLoading } = useTasks({ includeCompleted: true, limit: 100 })
  const { data: notesData, isLoading: notesLoading } = useNotes({ limit: 100 })
  const { data: companiesData, isLoading: companiesLoading } = useCompanies()

  const isLoading = tasksLoading || notesLoading || companiesLoading

  const tasks = tasksData?.tasks || []
  const notes = notesData?.notes || []
  const companies = companiesData?.companies || []

  const activeTasks = tasks.filter(t => t.status !== 'DONE')
  const completedTasks = tasks.filter(t => t.status === 'DONE')
  const recentTasks = [...tasks].sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 5)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{getGreeting()}, Marc</h1>
        <p className="text-slate-400">Here's what's happening with your businesses.</p>
      </header>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <StatCard 
              label="Active Tasks" 
              value={activeTasks.length} 
              change={`${tasks.filter(t => t.status === 'IN_PROGRESS').length} in progress`}
              icon={CheckSquare}
              color="blue"
            />
            <StatCard 
              label="Notes" 
              value={notes.length} 
              change="Knowledge base"
              icon={FileText}
              color="purple"
            />
            <StatCard 
              label="Companies" 
              value={companies.length} 
              change="Active businesses"
              icon={Building2}
              color="green"
            />
            <StatCard 
              label="Completed" 
              value={completedTasks.length} 
              change="Tasks done"
              icon={TrendingUp}
              color="amber"
            />
          </div>

          <div className="grid grid-cols-3 gap-6">
            {/* Recent Activity */}
            <div className="col-span-2 card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Recent Tasks</h2>
                <Link to="/tasks" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentTasks.length === 0 ? (
                  <p className="text-slate-500 text-center py-4">No tasks yet</p>
                ) : (
                  recentTasks.map(task => {
                    const company = companies.find(c => c.id === task.companyId)
                    return (
                      <ActivityItem 
                        key={task.id}
                        title={task.title}
                        subtitle={company?.name}
                        time={formatRelativeTime(task.updatedAt)}
                        status={task.status}
                      />
                    )
                  })
                )}
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
                    <CheckSquare className="w-4 h-4" /> View Tasks
                  </Link>
                </div>
              </div>

              {/* Companies Overview */}
              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Companies</h2>
                </div>
                <div className="space-y-2">
                  {companies.slice(0, 4).map(company => (
                    <div 
                      key={company.id}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/50"
                    >
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: company.color }}
                      />
                      <span className="text-sm">{company.name}</span>
                    </div>
                  ))}
                  {companies.length > 4 && (
                    <p className="text-xs text-slate-500 text-center pt-2">
                      +{companies.length - 4} more
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Unknown'
  
  const now = Date.now()
  const diff = now - timestamp
  
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

function ActivityItem({ title, subtitle, time, status }) {
  const statusColors = {
    TODO: 'bg-slate-500',
    IN_PROGRESS: 'bg-blue-500',
    WAITING: 'bg-amber-500',
    DONE: 'bg-green-500',
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg">
      <div className={`w-2 h-2 rounded-full ${statusColors[status] || statusColors.TODO}`} />
      <div className="flex-1">
        <p className="text-sm">{title}</p>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>
      <p className="text-xs text-slate-500 flex items-center gap-1">
        <Clock className="w-3 h-3" /> {time}
      </p>
    </div>
  )
}
