import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Clock, Tag } from 'lucide-react'

export default function NotePage() {
  const { id } = useParams()

  // TODO: Fetch note from LifeOS API
  const note = {
    id,
    title: 'Business Structure Overview',
    content: `# Business Structure Overview

Marc runs multiple interconnected companies. Here's the structure:

## Insurance / Agency ("Fortified" umbrella)
- **Fortified Insurance** — Sunsetting IMO being replaced by Summit
- **Summit Insurance Advisors** — New primary agency
- **CoreCare, Bastion** — Additional agencies under the umbrella
- **Products:** Limited indemnity, MECs, discount plans, ACA
- **TPA:** Premier Health Solutions

## Sentinel
- TPA owned by Marc
- Offers discount health products
- Platform for selling Formulyt

## Weight Loss Programs
- **Formulyt** — Physician-supervised weight loss, membership-based
- **True Meds / My True Meds** — Similar program on a different TPA

## Marketing & Leads
- **InstaQuote** — Marketing company, transitioning to Formulyt call center

## Peptides & Distribution
- **Vertryeb** — Sells lyophilized peptides to physicians
- **PeptUSA** — Division of Vertryeb exporting to Latin America

## Telehealth
- **Apex Telemeds** — Telehealth platform connecting patients to doctors`,
    tags: ['business', 'reference'],
    company: 'Fortified',
    createdAt: 'Feb 5, 2026',
    updatedAt: 'Feb 5, 2026'
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/notes" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{note.title}</h1>
          <div className="flex items-center gap-4 mt-1 text-sm text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> Updated {note.updatedAt}
            </span>
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" /> {note.company}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary flex items-center gap-2">
            <Edit className="w-4 h-4" /> Edit
          </button>
          <button className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex gap-2 mb-6">
        {note.tags.map(tag => (
          <span key={tag} className="text-sm px-3 py-1 bg-slate-800 rounded-full text-slate-300">
            #{tag}
          </span>
        ))}
      </div>

      {/* Content */}
      <div className="card prose prose-invert max-w-none">
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {note.content}
        </div>
      </div>
    </div>
  )
}
