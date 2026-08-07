"use client"

import { useState } from 'react'
import { Plus, Search, Edit } from 'lucide-react'

const mockColleges = [
  { id: '1', name: 'KIIT University', code: 'KIIT', city: 'Bhubaneswar', state: 'Odisha', emailDomain: 'kiit.ac.in', ambassadors: 2 },
  { id: '2', name: 'VIT Vellore', code: 'VIT', city: 'Vellore', state: 'Tamil Nadu', emailDomain: 'vit.ac.in', ambassadors: 1 },
]

export default function CollegesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Colleges Registry</h1>
          <p className="text-muted-foreground mt-1">Manage onboarded educational institutions.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add College
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-muted/20">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search colleges by name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">College Name</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Code</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Location</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Email Domain</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Ambassadors</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockColleges.map((college) => (
                <tr key={college.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{college.name}</td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">{college.code}</td>
                  <td className="px-6 py-4 text-muted-foreground">{college.city}, {college.state}</td>
                  <td className="px-6 py-4 text-primary">{college.emailDomain}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary/10 text-primary font-medium text-xs">
                      {college.ambassadors}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Add College</h2>
              <p className="text-sm text-muted-foreground mt-1">Register a new institution to the platform.</p>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">College Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. KIIT University" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">College Code</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. KIIT" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input type="text" className="w-full px-4 py-2 rounded-xl border bg-background" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input type="text" className="w-full px-4 py-2 rounded-xl border bg-background" required />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Official Email Domain</label>
                  <input type="text" className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. kiit.ac.in" required />
                  <p className="text-xs text-muted-foreground mt-1">Used to verify ambassadors and societies.</p>
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
                Save College
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
