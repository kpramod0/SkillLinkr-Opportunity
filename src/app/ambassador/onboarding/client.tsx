"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { activateAmbassadorAccount } from '@/app/actions/onboarding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Lock } from 'lucide-react'

export default function AmbassadorOnboardingClient({ 
  invitation 
}: { 
  invitation: { email: string, name: string, college: string, phone: string } 
}) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    academic_year: '',
    graduation_year: '',
    branch: '',
    course: '',
    student_id: '',
    linkedin_url: '',
    photo_url: '',
    is_society_member: false,
    societies: [{ society_name: '', society_role: '' }]
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData(prev => ({ ...prev, [name]: val }))
  }

  const handleSocietyChange = (index: number, field: 'society_name' | 'society_role', value: string) => {
    const newSocieties = [...formData.societies]
    newSocieties[index][field] = value
    setFormData(prev => ({ ...prev, societies: newSocieties }))
  }

  const addSociety = () => {
    setFormData(prev => ({
      ...prev,
      societies: [...prev.societies, { society_name: '', society_role: '' }]
    }))
  }

  const removeSociety = (index: number) => {
    if (formData.societies.length > 1) {
      setFormData(prev => ({
        ...prev,
        societies: prev.societies.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await activateAmbassadorAccount({
        ...formData,
        graduation_year: parseInt(formData.graduation_year)
      })
      router.refresh()
      router.push('/ambassador/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to complete onboarding')
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      {/* Locked Fields */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
        <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-gray-700">
          <Lock className="w-4 h-4" /> Locked Information
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Full Name</label>
            <div className="text-sm text-gray-900 font-medium bg-white p-2 border rounded-lg">{invitation.name}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <div className="text-sm text-gray-900 font-medium bg-white p-2 border rounded-lg">{invitation.email}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">College</label>
            <div className="text-sm text-gray-900 font-medium bg-white p-2 border rounded-lg truncate">{invitation.college}</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Mobile Number</label>
            <div className="text-sm text-gray-900 font-medium bg-white p-2 border rounded-lg">{invitation.phone || 'N/A'}</div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">To change this information, please contact an administrator.</p>
      </div>

      <div className="h-px bg-gray-100 my-6" />
      <h3 className="text-lg font-semibold text-gray-900">Academic Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
          <select 
            name="academic_year" 
            value={formData.academic_year} 
            onChange={handleChange}
            required
            className="w-full h-10 px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
          >
            <option value="">Select Year</option>
            <option value="First Year">First Year</option>
            <option value="Second Year">Second Year</option>
            <option value="Third Year">Third Year</option>
            <option value="Fourth Year">Fourth Year</option>
            <option value="Postgraduate">Postgraduate</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
          <Input 
            name="graduation_year"
            type="number" 
            min="2020" max="2035"
            value={formData.graduation_year} 
            onChange={handleChange} 
            required 
            placeholder="e.g. 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course / Degree</label>
          <Input 
            name="course"
            type="text" 
            value={formData.course} 
            onChange={handleChange} 
            required 
            placeholder="e.g. B.Tech"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Branch / Department</label>
          <Input 
            name="branch"
            type="text" 
            value={formData.branch} 
            onChange={handleChange} 
            required 
            placeholder="e.g. Computer Science"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Student ID <span className="text-gray-400 font-normal">(Optional)</span></label>
          <Input 
            name="student_id"
            type="text" 
            value={formData.student_id} 
            onChange={handleChange} 
          />
        </div>
      </div>

      <div className="h-px bg-gray-100 my-6" />
      <h3 className="text-lg font-semibold text-gray-900">Profile Links</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL <span className="text-gray-400 font-normal">(Optional)</span></label>
          <Input 
            name="linkedin_url"
            type="url" 
            value={formData.linkedin_url} 
            onChange={handleChange} 
            placeholder="https://linkedin.com/in/..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL <span className="text-gray-400 font-normal">(Optional)</span></label>
          <Input 
            name="photo_url"
            type="url" 
            value={formData.photo_url} 
            onChange={handleChange} 
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="h-px bg-gray-100 my-6" />
      <h3 className="text-lg font-semibold text-gray-900">Society Membership</h3>
      <p className="text-sm text-gray-500 mb-4">Are you currently part of a society at your university? This allows you to post opportunities directly.</p>

      <div className="p-4 border rounded-xl bg-gray-50">
        <label className="flex items-center gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            name="is_society_member"
            checked={formData.is_society_member}
            onChange={handleChange}
            className="w-5 h-5 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
          />
          <span className="font-medium text-gray-700">Yes, I am a member of a society</span>
        </label>
        
        {formData.is_society_member && (
          <div className="mt-4 pt-4 border-t border-gray-200 animate-in fade-in slide-in-from-top-2">
            {formData.societies.map((society, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4 relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                {formData.societies.length > 1 && (
                  <button 
                    type="button" 
                    onClick={() => removeSociety(idx)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center hover:bg-red-200 transition-colors"
                  >
                    ×
                  </button>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Society Name</label>
                  <Input 
                    value={society.society_name} 
                    onChange={(e) => handleSocietyChange(idx, 'society_name', e.target.value)} 
                    required={formData.is_society_member} 
                    placeholder="e.g. Computer Science Society"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Your Role / Position</label>
                  <Input 
                    value={society.society_role} 
                    onChange={(e) => handleSocietyChange(idx, 'society_role', e.target.value)} 
                    required={formData.is_society_member} 
                    placeholder="e.g. President, Core Member"
                  />
                </div>
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addSociety} className="w-full text-sm mt-2 border-dashed">
              + Add Another Society
            </Button>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
        Activate Account
      </Button>
    </form>
  )
}
