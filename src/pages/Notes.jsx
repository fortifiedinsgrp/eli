import { Link } from 'react-router-dom'
import { Plus, FileText, Search, Tag, Clock } from 'lucide-react'

const notes = [
  { 
    id: 1, 
    title: 'Business Structure Overview', 
    preview: 'Marc runs multiple interconnected companies under the Fortified umbrella...', 
    tags: ['business', 'reference'],
    updatedAt: 'Feb 5, 2026',
    company: 'Fortified'
  },
  { 
    id: 2, 
    title: 'LifeOS API Documentation', 
    preview: 'Captain\'s Log CRM API endpoints and authentication flow...', 
    tags: ['technical', 'api'],
    updatedAt: 'Feb 5, 2026',
    company: 'Personal'
  },
  { 
    id: 3, 
    title: 'Trading Algorithm Ideas', 
    preview: 'Initial brainstorm for automated trading strategies using Massive.com data...', 
    tags: ['trading', 'ideas'],
    updatedAt: 'Feb 5, 2026',
    company: 'Personal'
  },
]

export default function Notes() {
  return (
    <div className="p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-slate-400">Knowledge base and documentation</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Note
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search notes..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-3 gap-4">
        {notes.map(note => (
          <NoteCard key={note.id} note={note} />
        ))}
      </div>
    </div>
  )
}

function NoteCard({ note }) {
  return (
    <Link to={`/notes/${note.id}`} className="card hover:border-slate-700 transition-colors group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium group-hover:text-blue-400 transition-colors truncate">{note.title}</h3>
          <p className="text-xs text-slate-500">{note.company}</p>
        </div>
      </div>
      
      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{note.preview}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {note.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {note.updatedAt}
        </span>
      </div>
    </Link>
  )
}
