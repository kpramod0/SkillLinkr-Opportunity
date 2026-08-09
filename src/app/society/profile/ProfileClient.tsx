"use client"

import { useState } from 'react'
import { Save, User, Building2, Phone, Briefcase, ShieldCheck, ShieldAlert, Calendar } from 'lucide-react'
import { updateSocietyProfile } from '@/app/actions/profile'
import { useRouter } from 'next/navigation'

export function ProfileClient({ profileData }: { profileData: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const [formData, setFormData] = useState({
    society_name: profileData.society_name,
    representative_name: profileData.representative_name,
    contact_number: profileData.contact_number,
    position: profileData.position
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccessMsg('')
    setErrorMsg('')
    
    try {
      await updateSocietyProfile(formData)
      setSuccessMsg('Profile updated successfully!')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <Building2 className="h-8 w-8 text-primary" />
          Society Profile
        </h1>
        <p className="text-muted-foreground mt-1">Manage your society's identity and representative details.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Read-Only Metadata */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl mb-4">
              {formData.society_name.substring(0, 2).toUpperCase()}
            </div>
            <h2 className="font-bold text-lg text-foreground">{formData.society_name}</h2>
            <p className="text-sm text-muted-foreground">{profileData.college_name}</p>
            
            <div className="mt-6 w-full pt-6 border-t space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Status
                </span>
                {profileData.is_verified ? (
                  <span className="font-medium text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">Verified</span>
                ) : (
                  <span className="font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldAlert className="h-3 w-3" /> Pending
                  </span>
                )}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined
                </span>
                <span className="font-medium text-foreground">{new Date(profileData.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editable Form */}
        <div className="md:col-span-2">
          <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-muted/10">
              <h3 className="font-bold text-foreground">Edit Details</h3>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-6">
              
              {successMsg && (
                <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  {successMsg}
                </div>
              )}
              
              {errorMsg && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-xl text-sm font-medium flex items-center gap-2">
                  <ShieldAlert className="h-5 w-5" />
                  {errorMsg}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Society Name <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    name="society_name" 
                    required
                    value={formData.society_name} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      Representative Name <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="representative_name" 
                      required
                      value={formData.representative_name} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      Position / Role <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" 
                      name="position" 
                      required
                      value={formData.position} 
                      onChange={handleChange} 
                      className="w-full px-4 py-2.5 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                      placeholder="e.g. President, Lead"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1.5 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    Contact Number
                  </label>
                  <input 
                    type="text" 
                    name="contact_number" 
                    value={formData.contact_number} 
                    onChange={handleChange} 
                    className="w-full px-4 py-2.5 rounded-xl border bg-background focus:ring-2 focus:ring-primary/20 transition-all outline-none" 
                    placeholder="+91..."
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  )
}
