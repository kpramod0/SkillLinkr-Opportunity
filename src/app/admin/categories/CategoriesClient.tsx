"use client"

import { useState } from 'react'
import { Plus, Edit, Trash2, Check, X, Loader2 } from 'lucide-react'
import { addCategory, deleteCategory } from '@/app/actions/categories'

export default function CategoriesClient({ initialCategories }: { initialCategories: any[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sort_order: 10
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addCategory(formData)
      setIsModalOpen(false)
      setFormData({ name: '', slug: '', sort_order: 10 })
    } catch (err: any) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id)
      } catch (err: any) {
        alert(err.message)
      }
    }
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1">Manage opportunity categories displayed on the platform.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-muted/30 border-b">
            <tr>
              <th className="px-6 py-4 font-medium text-muted-foreground">Order</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Name</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Slug</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Opportunities</th>
              <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
              <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {initialCategories.map((cat) => (
              <tr key={cat.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-6 py-4 text-muted-foreground font-mono">{cat.sort_order}</td>
                <td className="px-6 py-4 font-bold text-foreground">{cat.name}</td>
                <td className="px-6 py-4 text-muted-foreground font-mono bg-muted/30 rounded inline-block mt-3 mb-3 ml-6">{cat.slug}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center justify-center h-6 px-2 rounded-full bg-primary/10 text-primary font-medium text-xs">
                    {cat.oppCount}
                  </span>
                </td>
                <td className="px-6 py-4">
                  {cat.is_active ? (
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
                    <button 
                      onClick={() => handleDelete(cat.id)}
                      className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
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
              <h2 className="text-xl font-bold">Add Category</h2>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar">
              <form id="cat-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Category Name</label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={e => {
                      const name = e.target.value
                      setFormData({ 
                        ...formData, 
                        name, 
                        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') 
                      })
                    }}
                    className="w-full px-4 py-2 rounded-xl border bg-background" 
                    placeholder="e.g. Hackathons" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Slug</label>
                  <input 
                    type="text" 
                    value={formData.slug}
                    onChange={e => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 rounded-xl border bg-background" 
                    placeholder="e.g. hackathons" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Sort Order</label>
                  <input 
                    type="number" 
                    value={formData.sort_order}
                    onChange={e => setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-2 rounded-xl border bg-background" 
                    required 
                  />
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t bg-muted/20 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 border rounded-xl hover:bg-muted transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="cat-form"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
