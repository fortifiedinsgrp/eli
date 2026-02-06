import { Outlet, NavLink } from 'react-router-dom'
import { 
  Home, MessageSquare, CheckSquare, Clock, 
  FileText, Calendar, FolderOpen, Zap 
} from 'lucide-react'

const navItems = [
  { to: '/', icon: Home, label: 'Dashboard' },
  { to: '/chat', icon: MessageSquare, label: 'Chat' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/history', icon: Clock, label: 'History' },
  { to: '/notes', icon: FileText, label: 'Notes' },
  { to: '/digests', icon: Calendar, label: 'Daily Digests' },
  { to: '/documents', icon: FolderOpen, label: 'Documents' },
]

export default function Layout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Eli</h1>
              <p className="text-xs text-slate-500">AI Assistant</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink 
              key={to} 
              to={to} 
              end={to === '/'}
              className={({ isActive }) => 
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              <Icon className="w-5 h-5" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="card !p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-slate-400">Online</span>
            </div>
            <p className="text-xs text-slate-500">Connected to OpenClaw</p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}
