"use client"

import { useState } from 'react'
import { Plus, Search, Filter, Edit, Ban, CheckCircle, XCircle } from 'lucide-react'
import { registerAmbassador } from '@/app/actions/users'

export function AmbassadorsClient({ ambassadors, colleges }: { ambassadors: any[], colleges: any[] }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    fullName: '', email: '', collegeId: '', contactNumber: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await registerAmbassador({
        email: formData.email,
        college_id: formData.collegeId,
        full_name: formData.fullName,
        mobile_number: formData.contactNumber,
      })
      setIsRegisterModalOpen(false)
      setFormData({
        fullName: '', email: '', collegeId: '', contactNumber: ''
      })
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Ambassador Management</h1>
          <p className="text-muted-foreground mt-1">Register and manage Campus Ambassadors across colleges.</p>
        </div>
        <button 
          onClick={() => setIsRegisterModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Register Ambassador
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between bg-muted/20">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search ambassadors by name, email, or college..."
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
                <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">College</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Email</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Department / Designation</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {ambassadors.map((ambassador) => (
                <tr key={ambassador.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">{ambassador.opp_ambassadors?.[0]?.full_name || 'N/A'}</td>
                  <td className="px-6 py-4 text-foreground">{ambassador.opp_ambassadors?.[0]?.opp_colleges?.name || 'N/A'}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ambassador.email}</td>
                  <td className="px-6 py-4 text-muted-foreground">{ambassador.opp_ambassadors?.[0]?.department || 'N/A'} {ambassador.opp_ambassadors?.[0]?.designation ? `(${ambassador.opp_ambassadors?.[0]?.designation})` : ''}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      ambassador.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-500' 
                        : 'bg-red-500/10 text-red-500'
                    }`}>
                      {ambassador.status === 'active' ? <CheckCircle className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                      <span className="capitalize">{ambassador.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors">
                        {ambassador.status === 'active' ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Register Campus Ambassador</h2>
                <p className="text-sm text-muted-foreground mt-1">Create a new ambassador account linked to a college.</p>
              </div>
              <button 
                onClick={() => setIsRegisterModalOpen(false)}
                className="p-2 rounded-xl hover:bg-muted transition-colors"
                disabled={loading}
              >
                <XCircle className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">College</label>
                    <select name="collegeId" value={formData.collegeId} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" required>
                      <option value="">Select College</option>
                      {colleges.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.domain_pattern})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Contact Number</label>
                    <input type="tel" name="contactNumber" value={formData.contactNumber} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" />
                  </div>

                </div>
              </div>
              
              <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsRegisterModalOpen(false)}
                  disabled={loading}
                  className="px-6 py-2 border rounded-xl hover:bg-muted transition-colors font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
