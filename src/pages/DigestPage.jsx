import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, CheckSquare, MessageSquare, FileText, TrendingUp } from 'lucide-react'

export default function DigestPage() {
  const { id } = useParams()

  // TODO: Fetch digest from backend
  const digest = {
    id,
    date: 'February 5, 2026',
    day: 'Wednesday',
    summary: 'A productive setup day. Got the full OpenClaw stack running, integrated with LifeOS, and started building the Eli dashboard.',
    sections: [
      {
        title: 'Completed Tasks',
        icon: CheckSquare,
        color: 'green',
        items: [
          'OpenClaw installation and configuration',
          'Google Chat channel setup with Tailscale Funnel',
          'LifeOS API integration via Firebase service account',
          'Created fortifiedinsgrp/eli repository'
        ]
      },
      {
        title: 'Conversations',
        icon: MessageSquare,
        color: 'blue',
        items: [
          'Discussed business structure and company relationships',
          'Planned trading algorithm approach',
          'Reviewed ClawHub skills for installation'
        ]
      },
      {
        title: 'Notes Created',
        icon: FileText,
        color: 'purple',
        items: [
          'Business Structure Overview',
          'LifeOS API Documentation'
        ]
      },
      {
        title: 'Key Metrics',
        icon: TrendingUp,
        color: 'amber',
        items: [
          '7 companies documented in LifeOS',
          '19 ClawHub skills installed',
          'Full API access to CRM established'
        ]
      }
    ]
  }

  const colors = {
    green: 'bg-green-500/20 text-green-400',
    blue: 'bg-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/20 text-purple-400',
    amber: 'bg-amber-500/20 text-amber-400',
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link to="/digests" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{digest.date}</h1>
              <p className="text-slate-400">{digest.day}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="card mb-6">
        <h2 className="text-lg font-semibold mb-2">Summary</h2>
        <p className="text-slate-300">{digest.summary}</p>
      </div>

      {/* Sections */}
      <div className="grid grid-cols-2 gap-4">
        {digest.sections.map((section) => {
          const Icon = section.icon
          return (
            <div key={section.title} className="card">
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-8 h-8 rounded-lg ${colors[section.color]} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-semibold">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                    <span className="text-slate-600 mt-1">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
