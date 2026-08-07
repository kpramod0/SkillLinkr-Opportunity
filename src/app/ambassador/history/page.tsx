"use client"

import { useState } from 'react'
import { Search, Filter, ExternalLink, CheckCircle, Ban, History as HistoryIcon } from 'lucide-react'
import Link from 'next/link'

const mockHistory = [
  { id: '101', title: 'CodeSprint 2026', society: 'Code Club', date: '2026-08-05', action: 'Approved', status: 'published' },
  { id: '102', title: 'Designathon', society: 'UI/UX Society', date: '2026-08-03', action: 'Requested Correction', status: 'correction_submitted' },
  { id: '103', title: 'Web3 Summit', society: 'Crypto Club', date: '2026-08-01', action: 'Rejected', status: 'rejected' },
  { id: '104', title: 'App Dev Bootcamp', society: 'Mobile Devs', date: '2026-07-28', action: 'Approved', status: 'published' },
]

export default function AmbassadorHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Reviews</h1>
        <p className="text-muted-foreground mt-1">History of all submissions you have reviewed.</p>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between bg-muted/20">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search history..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
          <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted/50 transition-colors">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Review Date</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Opportunity Title</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Society</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">My Action</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Current Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockHistory.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <HistoryIcon className="h-4 w-4 text-muted-foreground" />
                      {item.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground font-medium">{item.title}</td>
                  <td className="px-6 py-4 text-muted-foreground">{item.society}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      item.action === 'Approved' ? 'bg-emerald-500/10 text-emerald-500' :
                      item.action === 'Requested Correction' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-red-500/10 text-red-500'
                    }`}>
                      {item.action === 'Approved' ? <CheckCircle className="h-3 w-3" /> : item.action === 'Rejected' ? <Ban className="h-3 w-3" /> : <div className="h-2 w-2 rounded-full bg-amber-500"></div>}
                      {item.action}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-xs font-bold text-muted-foreground">
                      {item.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/ambassador/review/${item.id}`} className="inline-flex p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
