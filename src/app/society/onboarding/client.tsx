"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { registerSocietySelf, sendVerificationOtp, verifyOtp } from '@/app/actions/onboarding'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, Lock, CheckCircle, Upload, X, Mail, Phone, Link } from 'lucide-react'

const STEPS = [
  { id: 1, title: 'Email Verification' },
  { id: 2, title: 'Society Details' },
  { id: 3, title: 'Media & Socials' },
]

export default function SocietyOnboardingClient({ 
  identity 
}: { 
  identity: { email: string, collegeName: string } 
}) {
  const router = useRouter()
  
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [isOtpVerified, setIsOtpVerified] = useState(false)
  
  // Upload State
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [formData, setFormData] = useState({
    representative_name: '',
    society_name: '',
    position: '',
    contact_number: '',
    photos: [] as string[],
    linkedin_url: '',
    instagram_url: '',
    whatsapp_number: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSendOtp = async () => {
    setIsLoading(true)
    setError('')
    try {
      await sendVerificationOtp()
      setOtpSent(true)
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setError('Please enter a valid 6-digit code.')
      return
    }
    setIsLoading(true)
    setError('')
    try {
      await verifyOtp(otpCode)
      setIsOtpVerified(true)
      setCurrentStep(2) // Move to next step
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    setError('')
    const uploadData = new FormData()
    uploadData.append('file', file)

    try {
      const res = await fetch('/api/v1/uploads/images', {
        method: 'POST',
        body: uploadData,
      })
      const data = await res.json()
      if (data.success) {
        setFormData(prev => ({
          ...prev,
          photos: [...prev.photos, data.urls.medium] // Store medium resolution
        }))
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch (err: any) {
      setError('Upload failed: ' + err.message)
    } finally {
      setUploadingImage(false)
    }
  }

  const removePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async () => {

    setIsLoading(true)
    setError('')

    try {
      const payload = {
        representative_name: formData.representative_name,
        societies: [
          {
            society_name: formData.society_name,
            position: formData.position
          }
        ],
        contact_number: formData.contact_number,
        photos: formData.photos,
        linkedin_url: formData.linkedin_url,
        instagram_url: formData.instagram_url,
        whatsapp_number: formData.whatsapp_number,
        is_society_member: true
      }

      await registerSocietySelf(payload)
      router.refresh()
      router.push('/society/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to register society')
      setIsLoading(false)
    }
  }

  const nextStep = () => {
    if (currentStep === 2) {
      if (!formData.society_name || !formData.representative_name || !formData.position) {
        setError('Please fill all required fields.')
        return
      }
    }
    setError('')
    setCurrentStep(prev => Math.min(prev + 1, STEPS.length))
  }

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1))

  return (
    <div className="space-y-6">
      
      {/* Wizard Header */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10 w-full">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
              currentStep > step.id ? 'bg-cyan-600 text-white' :
              currentStep === step.id ? 'bg-cyan-600 text-white ring-4 ring-cyan-600/20' :
              'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > step.id ? <CheckCircle className="h-4 w-4" /> : step.id}
            </div>
            <p className={`text-xs mt-2 font-medium hidden sm:block ${
              currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'
            }`}>{step.title}</p>
            
            {index < STEPS.length - 1 && (
              <div className={`absolute top-4 left-1/2 w-full h-0.5 -z-10 ${
                currentStep > step.id ? 'bg-cyan-600' : 'bg-gray-200'
              }`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm min-h-[350px]">
        {error && (
          <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
            {error}
          </div>
        )}

        {/* STEP 1: OTP Verification */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-cyan-50 rounded-full flex items-center justify-center text-cyan-600 mb-4">
                <Mail className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Verify Official Email</h2>
              <p className="text-sm text-gray-500">We need to verify your university email before you can register the society.</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Email to Verify</label>
                <div className="text-sm text-gray-900 font-medium bg-white p-2 border rounded-lg flex items-center gap-2">
                  <Lock className="h-4 w-4 text-gray-400" />
                  {identity.email}
                </div>
              </div>
            </div>

            {!otpSent ? (
              <Button onClick={handleSendOtp} disabled={isLoading} className="w-full h-12 bg-cyan-600 hover:bg-cyan-700">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Send Verification Code
              </Button>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit Code</label>
                  <Input 
                    type="text" 
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="text-center tracking-[0.5em] text-lg h-12 font-bold"
                  />
                </div>
                <Button onClick={handleVerifyOtp} disabled={isLoading || otpCode.length !== 6} className="w-full h-12 bg-emerald-600 hover:bg-emerald-700">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Verify & Continue
                </Button>
                <div className="text-center">
                  <button onClick={handleSendOtp} disabled={isLoading} className="text-sm text-cyan-600 hover:underline">
                    Resend Code
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 2: Basic Details */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Society Name <span className="text-red-500">*</span></label>
              <Input 
                name="society_name"
                value={formData.society_name} 
                onChange={handleChange} 
                placeholder="e.g. Computer Science Society"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Representative Name <span className="text-red-500">*</span></label>
                <Input 
                  name="representative_name"
                  value={formData.representative_name} 
                  onChange={handleChange} 
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Position / Role <span className="text-red-500">*</span></label>
                <Input 
                  name="position"
                  value={formData.position} 
                  onChange={handleChange} 
                  placeholder="e.g. President, Secretary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Number (Optional)</label>
              <Input 
                name="contact_number"
                type="tel" 
                value={formData.contact_number} 
                onChange={handleChange} 
                placeholder="+1234567890"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Media & Socials */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Society Photos / Logos (Optional)</label>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageUpload}
              />
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                {formData.photos.map((photo, idx) => (
                  <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border">
                    <img src={photo} alt="Upload" className="w-full h-full object-cover" />
                    <button 
                      onClick={() => removePhoto(idx)}
                      className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black text-white rounded-full transition-colors backdrop-blur-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                
                {formData.photos.length < 4 && (
                  <div 
                    onClick={() => !uploadingImage && fileInputRef.current?.click()}
                    className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors ${
                      uploadingImage ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:bg-gray-50 cursor-pointer'
                    }`}
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
                    ) : (
                      <>
                        <Upload className="h-6 w-6 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 font-medium">Add Photo</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="h-px bg-gray-100" />

            {/* Social Links */}
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Social Links & Connect (Optional)</label>
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  name="linkedin_url"
                  value={formData.linkedin_url} 
                  onChange={handleChange} 
                  className="pl-10"
                  placeholder="https://linkedin.com/company/your-society"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  name="instagram_url"
                  value={formData.instagram_url} 
                  onChange={handleChange} 
                  className="pl-10"
                  placeholder="https://instagram.com/your-society"
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-4 w-4 text-gray-400" />
                </div>
                <Input 
                  name="whatsapp_number"
                  value={formData.whatsapp_number} 
                  onChange={handleChange} 
                  className="pl-10"
                  placeholder="WhatsApp Number (e.g. +1234567890)"
                />
              </div>
            </div>

          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      {currentStep > 1 && (
        <div className="flex items-center justify-between pt-4">
          <Button 
            variant="outline"
            onClick={prevStep} 
            disabled={isLoading}
          >
            Back
          </Button>
          
          {currentStep < STEPS.length ? (
            <Button onClick={nextStep} className="bg-cyan-600 hover:bg-cyan-700">
              Continue
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700 px-8"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Complete Registration
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
