import { useState } from 'react'
import { Upload, File, FileText, Image, Download, Trash2, Search, FolderOpen } from 'lucide-react'

const mockDocuments = [
  { id: 1, name: 'Premier_TPA_Contract.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: 'Feb 5, 2026' },
  { id: 2, name: 'Formulyt_Pricing_2026.xlsx', type: 'spreadsheet', size: '156 KB', uploadedAt: 'Feb 5, 2026' },
  { id: 3, name: 'Company_Logo.png', type: 'image', size: '89 KB', uploadedAt: 'Feb 5, 2026' },
]

export default function Documents() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    // TODO: Handle file upload
    const files = e.dataTransfer.files
    console.log('Dropped files:', files)
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
        <Upload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-blue-400' : 'text-slate-500'}`} />
        <p className="text-lg font-medium mb-1">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="text-slate-500 mb-4">or</p>
        <label className="btn-primary cursor-pointer">
          <input type="file" className="hidden" multiple />
          Browse Files
        </label>
        <p className="text-xs text-slate-500 mt-4">
          Supported: PDF, Word, Excel, Images (max 50MB)
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input 
          type="text"
          placeholder="Search documents..."
          className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Documents List */}
      <div className="card !p-0 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-800/50">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Name</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Size</th>
              <th className="text-left px-4 py-3 text-sm font-medium text-slate-400">Uploaded</th>
              <th className="text-right px-4 py-3 text-sm font-medium text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {mockDocuments.map(doc => (
              <DocumentRow key={doc.id} document={doc} />
            ))}
          </tbody>
        </table>

        {mockDocuments.length === 0 && (
          <div className="p-12 text-center text-slate-500">
            <FolderOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No documents yet</p>
            <p className="text-sm mt-1">Upload files to get started</p>
          </div>
        )}
      </div>
    </div>
  )
}

function DocumentRow({ document }) {
  const icons = {
    pdf: <FileText className="w-5 h-5 text-red-400" />,
    spreadsheet: <File className="w-5 h-5 text-green-400" />,
    image: <Image className="w-5 h-5 text-purple-400" />,
    default: <File className="w-5 h-5 text-slate-400" />,
  }

  return (
    <tr className="hover:bg-slate-800/50 transition-colors">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          {icons[document.type] || icons.default}
          <span className="font-medium">{document.name}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-400">{document.size}</td>
      <td className="px-4 py-3 text-slate-400">{document.uploadedAt}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-end gap-2">
          <button className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Download className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-red-500/20 rounded-lg text-slate-400 hover:text-red-400 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
