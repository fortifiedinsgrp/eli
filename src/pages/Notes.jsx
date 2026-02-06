import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, FileText, Search, Tag, Clock, Loader2, X } from 'lucide-react'
import { useNotes, useCompanies, useCreateNote } from '../lib/hooks'

export default function Notes() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: notesData, isLoading } = useNotes({ limit: 100 })
  const { data: companiesData } = useCompanies()

  const notes = notesData?.notes || []
  const companies = companiesData?.companies || []

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-slate-400">Knowledge base and documentation</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Note
        </button>
      </header>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search notes..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-4 text-slate-500" />
          <p className="text-slate-400">
            {searchQuery ? 'No notes match your search' : 'No notes yet'}
          </p>
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary mt-4"
          >
            Create your first note
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} companies={companies} />
          ))}
        </div>
      )}

      {/* Add Note Modal */}
      {showAddModal && (
        <AddNoteModal 
          companies={companies}
          onClose={() => setShowAddModal(false)} 
        />
      )}
    </div>
  )
}

function NoteCard({ note, companies }) {
  const company = companies.find(c => c.id === note.companyId)
  
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Unknown'
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getPreview = (content) => {
    if (!content) return 'No content'
    // Strip markdown and get first 100 chars
    const stripped = content.replace(/[#*_`\[\]]/g, '').trim()
    return stripped.length > 100 ? stripped.slice(0, 100) + '...' : stripped
  }

  return (
    <Link to={`/notes/${note.id}`} className="card hover:border-slate-700 transition-colors group">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-purple-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium group-hover:text-blue-400 transition-colors truncate">{note.title}</h3>
          {company && <p className="text-xs text-slate-500">{company.name}</p>}
        </div>
      </div>
      
      <p className="text-sm text-slate-400 line-clamp-2 mb-3">{getPreview(note.content)}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {note.tags?.slice(0, 2).map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-slate-300">
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-slate-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {formatDate(note.updatedAt)}
        </span>
      </div>
    </Link>
  )
}

function AddNoteModal({ companies, onClose }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [companyId, setCompanyId] = useState('')
  const [tags, setTags] = useState('')
  
  const createNote = useCreateNote()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) return
    
    const tagList = tags.split(',').map(t => t.trim()).filter(Boolean)
    
    createNote.mutate({
      title: title.trim(),
      content: content.trim(),
      companyId: companyId || undefined,
      tags: tagList.length > 0 ? tagList : undefined,
    }, {
      onSuccess: () => onClose()
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-900 rounded-xl p-6 w-full max-w-2xl border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">New Note</h2>
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
              placeholder="Note title..."
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 resize-none font-mono text-sm"
              placeholder="Write your note..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
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

            <div>
              <label className="block text-sm font-medium mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="tag1, tag2, tag3"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={!title.trim() || !content.trim() || createNote.isPending}
              className="btn-primary flex-1 disabled:opacity-50"
            >
              {createNote.isPending ? 'Creating...' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
