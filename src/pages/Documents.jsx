import { useState, useCallback } from 'react'
import { Upload, File, FileText, Image, Download, Trash2, Search, FolderOpen, Loader2, AlertCircle } from 'lucide-react'
import { useDocuments, useUploadDocument, useDeleteDocument } from '../lib/hooks'

export default function Documents() {
  const [isDragging, setIsDragging] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { data: documents = [], isLoading, error } = useDocuments()
  const uploadDocument = useUploadDocument()
  const deleteDocument = useDeleteDocument()

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(file => {
      uploadDocument.mutate(file)
    })
  }, [uploadDocument])

  const handleFileSelect = useCallback((e) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      uploadDocument.mutate(file)
    })
    e.target.value = '' // Reset input
  }, [uploadDocument])

  const handleDelete = useCallback((id) => {
    if (confirm('Are you sure you want to delete this document?')) {
      deleteDocument.mutate(id)
    }
  }, [deleteDocument])

  const filteredDocuments = documents.filter(doc => 
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (error) {
    return (
      <div className="p-8">
        <div className="card bg-red-500/10 border-red-500/30 text-center py-8">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
          <p className="text-red-400 mb-2">Failed to load documents</p>
          <p className="text-sm text-slate-400">Make sure Firebase is configured correctly</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Documents</h1>
          <p className="text-slate-400">Upload and manage files</p>
        </div>
      </header>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center mb-6 transition-colors ${
          isDragging 
            ? 'border-blue-500 bg-blue-500/10' 
            : 'border-slate-700 hover:border-slate-600'
        }`}
      >
        {uploadDocument.isPending ? (
          <>
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-400 animate-spin" />
            <p className="text-lg font-medium mb-1">Uploading...</p>
          </>
        ) : (
          <>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-400' : 'text-slate-500'}`} />
            <p className="text-lg font-medium mb-1">
              {isDragging ? 'Drop files here' : 'Drag and drop files here'}
            </p>
            <p className="text-slate-500 mb-4">or</p>
            <label className="btn-primary cursor-pointer">
              <input 
                type="file" 
                className="hidden" 
                multiple 
                onChange={handleFileSelect}
              />
              Browse Files
            </label>
            <p className="text-xs text-slate-500 mt-4">
              Supported: PDF, Word, Excel, Images (max 50MB)
            </p>
          </>
        )}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search documents..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Documents List */}
      <div className="card !p-0 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 mx-auto mb-4 text-blue-400 animate-spin" />
            <p className="text-slate-400">Loading documents...</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>{searchQuery ? 'No documents match your search' : 'No documents yet'}</p>
            <p className="text-sm mt-1">Upload files to get started</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Name</th>
                <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Type</th>
                <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDocuments.map(doc => (
                <DocumentRow 
                  key={doc.id} 
                  document={doc} 
                  onDelete={handleDelete}
                  isDeleting={deleteDocument.isPending}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function DocumentRow({ document, onDelete, isDeleting }) {
  const icons = {
    pdf: <FileText className="w-5 h-5 text-red-400" />,
    document: <FileText className="w-5 h-5 text-blue-400" />,
    spreadsheet: <File className="w-5 h-5 text-green-400" />,
    image: <Image className="w-5 h-5 text-purple-400" />,
    text: <FileText className="w-5 h-5 text-slate-400" />,
    file: <File className="w-5 h-5 text-slate-400" />,
  }

  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {icons[document.type] || icons.file}
          <span className="font-medium">{document.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-400 capitalize">{document.type}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <a 
            href={document.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <Download className="w-4 h-4" />
          </a>
          <button 
            onClick={() => onDelete(document.id)}
            disabled={isDeleting}
            className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
