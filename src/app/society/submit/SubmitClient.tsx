"use client"

import { useState, useRef } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle, Save, Calendar, MapPin, Users, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { createOpportunity } from '@/app/actions/opportunities'
import { useRouter } from 'next/navigation'

const STEPS = [
  { id: 1, title: 'Basic Details' },
  { id: 2, title: 'Description & Links' },
  { id: 3, title: 'Date & Location' },
  { id: 4, title: 'Upload Poster' },
  { id: 5, title: 'Preview' },
]

export function SubmitClient({ categories, initialData }: { categories: any[], initialData?: any }) {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [imageUrls, setImageUrls] = useState<{ large: string, medium: string, thumbnail: string } | null>(null)
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category_id: initialData?.category_id || '',
    short_description: initialData?.short_description || '',
    description: initialData?.description || '',
    organizer: initialData?.organizer || '',
    eligibility: initialData?.eligibility || '',
    registration_link: initialData?.registration_link || '',
    event_starts: initialData?.event_starts || '',
    event_ends: initialData?.event_ends || '',
    mode: initialData?.mode || 'online',
    venue: initialData?.venue || '',
    max_participants: initialData?.max_participants?.toString() || '',
    id: initialData?.id || undefined
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/v1/uploads/images', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (data.success) {
        setImageUrls(data.urls)
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (err: any) {
      alert('Upload failed: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSave = async (isSubmit: boolean) => {
    if (!formData.title || !formData.category_id) {
      alert("Title and Category are required.")
      return
    }
    
    setLoading(true)
    try {
      const dataToSave = {
        ...formData,
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : null,
        imageUrls: imageUrls
      }
      
      await createOpportunity(dataToSave, isSubmit)
      router.push('/society/dashboard')
    } catch (e: any) {
      alert(e.message)
      setLoading(false)
    }
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <Link href="/society/dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-4 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">{initialData ? 'Resume Draft' : 'Create Opportunity'}</h1>
            <p className="text-muted-foreground mt-1">Submit a new event, hackathon, or workshop.</p>
          </div>
          <button 
            onClick={() => handleSave(false)}
            disabled={loading}
            className="flex items-center gap-2 bg-muted text-foreground px-4 py-2 rounded-xl font-medium hover:bg-muted/80 transition-colors border disabled:opacity-50"
          >
            <Save className="h-4 w-4 text-muted-foreground" />
            Save Draft
          </button>
        </div>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                currentStep > step.id ? 'bg-primary text-primary-foreground' :
                currentStep === step.id ? 'bg-primary text-primary-foreground ring-4 ring-primary/20' :
                'bg-muted text-muted-foreground'
              }`}>
                {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
              </div>
              <p className={`text-xs mt-2 font-medium hidden sm:block ${
                currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
              }`}>{step.title}</p>
              
              {index < STEPS.length - 1 && (
                <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                  currentStep > step.id ? 'bg-primary' : 'bg-muted'
                }`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold">Basic Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title <span className="text-red-500">*</span></label>
                  <input type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. Smart India Hackathon" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Category <span className="text-red-500">*</span></label>
                    <select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background">
                      <option value="">Select Category</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Organizer / Society Name</label>
                    <input type="text" name="organizer" value={formData.organizer} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. Tech Club" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Short Description (Max 150 chars)</label>
                  <input type="text" name="short_description" value={formData.short_description} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold">Description & Links</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background min-h-[150px] resize-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Eligibility Criteria</label>
                  <input type="text" name="eligibility" value={formData.eligibility} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="e.g. 1st & 2nd Year B.Tech" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Registration Link (External)</label>
                  <input type="url" name="registration_link" value={formData.registration_link} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" placeholder="https://..." />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold">Date & Location</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Start Date/Time</label>
                  <input type="datetime-local" name="event_starts" value={formData.event_starts} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">End Date/Time</label>
                  <input type="datetime-local" name="event_ends" value={formData.event_ends} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Mode</label>
                  <select name="mode" value={formData.mode} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background">
                    <option value="online">Online</option>
                    <option value="offline">Offline</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Venue (if Offline/Hybrid)</label>
                  <input type="text" name="venue" value={formData.venue} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Max Participants (Leave blank if unlimited)</label>
                  <input type="number" name="max_participants" value={formData.max_participants} onChange={handleChange} className="w-full px-4 py-2 rounded-xl border bg-background" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold">Upload Poster</h2>
              
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
              />
              
              {imageUrls ? (
                <div className="relative aspect-[4/5] max-w-sm mx-auto rounded-2xl overflow-hidden border">
                  <img src={imageUrls.medium} alt="Poster preview" className="w-full h-full object-cover" />
                  <button 
                    onClick={() => setImageUrls(null)}
                    className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black text-white rounded-full transition-colors backdrop-blur-sm"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => !uploadingImage && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors flex flex-col items-center justify-center min-h-[300px] ${
                    uploadingImage ? 'opacity-50 cursor-not-allowed bg-muted/50' : 'hover:bg-muted/50 cursor-pointer'
                  }`}
                >
                  <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                    {uploadingImage ? <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" /> : <Upload className="h-6 w-6" />}
                  </div>
                  <p className="font-medium text-foreground">
                    {uploadingImage ? 'Processing Image...' : 'Click to upload poster image'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">PNG, JPG up to 5MB (4:5 Aspect Ratio Recommended)</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-xl font-bold">Preview Submission</h2>
              <div className="bg-background border rounded-2xl p-6 space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-foreground">{formData.title || 'Untitled Opportunity'}</h1>
                  <p className="text-primary font-medium">{categories.find(c => c.id === formData.category_id)?.name || 'Category'}</p>
                </div>
                <p className="text-muted-foreground">{formData.description || 'No description provided.'}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4"/> {formData.event_starts ? new Date(formData.event_starts).toLocaleString() : 'TBD'}</span>
                  <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/> {formData.mode} {formData.venue ? `- ${formData.venue}` : ''}</span>
                  <span className="flex items-center gap-1.5"><Users className="h-4 w-4"/> {formData.max_participants || 'Unlimited'} Max</span>
                </div>
                {imageUrls && (
                   <div className="mt-4">
                     <p className="text-sm font-medium mb-2">Poster Attached:</p>
                     <img src={imageUrls.thumbnail} alt="Thumbnail" className="h-24 w-auto rounded-lg border shadow-sm" />
                   </div>
                )}
              </div>
              <div className="bg-emerald-500/10 text-emerald-500 p-4 rounded-xl flex items-center gap-3">
                <CheckCircle className="h-5 w-5" />
                <p className="text-sm font-medium">By submitting, this opportunity will be sent to your Campus Ambassador for review.</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-6 border-t mt-6">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 1 || loading}
            className="flex items-center gap-2 px-6 py-2.5 border rounded-xl font-medium hover:bg-muted transition-colors disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          
          {currentStep < STEPS.length ? (
            <button 
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
            >
              Next <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <button 
              onClick={() => handleSave(true)}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-2.5 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              Submit for Review <CheckCircle className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
