"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Check, X } from 'lucide-react'

const mockDomains = [
  { id: '1', name: 'Web Development', slug: 'web-development', isActive: true, oppCount: 245 },
  { id: '2', name: 'Artificial Intelligence', slug: 'artificial-intelligence', isActive: true, oppCount: 180 },
  { id: '3', name: 'Mobile App Dev', slug: 'mobile-app-dev', isActive: true, oppCount: 95 },
  { id: '4', name: 'UI/UX Design', slug: 'ui-ux-design', isActive: true, oppCount: 120 },
]

export default function DomainsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Domains</h1>
          <p className="text-muted-foreground mt-1">Manage domain tags used for filtering opportunities.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Domain
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-muted/30 border-b">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Slug</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Usage Count</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {mockDomains.map((dom) => (
              <tr key={dom.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 font-bold text-foreground">{dom.name}</td>
                <td className="px-6 py-4 text-muted-foreground font-mono bg-muted/30 rounded inline-block mt-3 mb-3 ml-6">{dom.slug}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-primary/10 text-primary font-medium text-xs">
                    {dom.oppCount}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {dom.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-500 font-medium">
                      <Check className="h-4 w-4" /> Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-muted-foreground font-medium">
                      <X className="h-4 w-4" /> Disabled
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Add Domain</h2>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Domain Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. Web Development" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. web-development" required />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border rounded-xl hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
