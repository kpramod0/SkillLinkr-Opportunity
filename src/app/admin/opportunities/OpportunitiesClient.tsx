"use client"

import { useState } from 'react'
import { Search, Filter, Edit, Star, Target, Globe, CheckCircle } from 'lucide-react'
import { publishOpportunity } from '@/app/actions/opportunities'

export function OpportunitiesClient({ opportunities }: { opportunities: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [loading, setLoading] = useState<string | null>(null)

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(opportunities.map(o => o.id))
    } else {
      setSelectedIds([])
    }
  }

  const handleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handlePublish = async (id: string) => {
    setLoading(id)
    try {
      await publishOpportunity(id)
    } catch (e: any) {
      alert(e.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Opportunities</h1>
          <p className="text-muted-foreground mt-1">Manage and moderate all opportunities across colleges.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between bg-muted/20">
          <div className="flex items-center gap-3 w-full max-w-2xl">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="Search by title or organizer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
              />
            </div>
            
            {/* Bulk Actions */}
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <span className="text-sm font-medium">{selectedIds.length} selected</span>
                <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-medium hover:bg-primary/20 transition-colors">
                  Bulk Actions
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4">
                  <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === opportunities.length && opportunities.length > 0} className="rounded border-muted-foreground" />
                </th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Title & Organizer</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">College / Category</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {opportunities.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">No opportunities found.</td>
                </tr>
              ) : opportunities.map((opp) => (
                <tr key={opp.id} className={`transition-colors ${selectedIds.includes(opp.id) ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/20'}`}>
                  <td className="px-6 py-4">
                    <input type="checkbox" checked={selectedIds.includes(opp.id)} onChange={() => handleSelect(opp.id)} className="rounded border-muted-foreground" />
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground truncate max-w-xs">{opp.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opp.organizer}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-foreground">{opp.opp_colleges?.name || 'Unknown'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{opp.opp_categories?.name || 'Unknown'}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                      opp.status === 'published' || opp.status === 'live' ? 'bg-blue-500/10 text-blue-500' :
                      opp.status === 'ready_for_publish' ? 'bg-emerald-500/10 text-emerald-500' :
                      opp.status === 'under_review' ? 'bg-amber-500/10 text-amber-500' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {opp.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {opp.status === 'ready_for_publish' ? (
                        <button 
                          onClick={() => handlePublish(opp.id)}
                          disabled={loading === opp.id}
                          title="Publish Now" 
                          className="p-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-lg transition-colors font-medium text-xs flex items-center gap-1 disabled:opacity-50"
                        >
                          <Globe className="h-4 w-4" /> Publish
                        </button>
                      ) : opp.status === 'published' ? (
                         <span className="text-emerald-500 flex items-center gap-1 text-xs font-bold px-2"><CheckCircle className="h-4 w-4"/> Published</span>
                      ) : ['submitted', 'under_review', 'correction_submitted'].includes(opp.status) ? (
                         <a 
                           href={`/admin/opportunities/review/${opp.id}`}
                           className="p-2 bg-amber-500/10 text-amber-500 hover:bg-amber-500 hover:text-white rounded-lg transition-colors font-medium text-xs flex items-center gap-1"
                         >
                           Review
                         </a>
                      ) : (
                         <span className="text-muted-foreground flex items-center gap-1 text-xs px-2">{opp.status.replace(/_/g, ' ')}</span>
                      )}
                    </div>
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
