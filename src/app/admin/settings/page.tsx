"use client"

import { Shield, Image as ImageIcon } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Platform Settings</h1>
        <p className="text-muted-foreground mt-1">Configure core functionality and super admin preferences.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b flex items-center gap-3 bg-muted/10">
            <Shield className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Super Admin Access</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Manage users with elevated privileges. Only Super Admins can add other admins.
            </p>
            
            <div className="flex gap-4">
              <input type="email" placeholder="Enter admin email address" className="flex-1 px-4 py-2 rounded-xl border bg-background" />
              <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium">
                Invite Admin
              </button>
            </div>
            
            <div className="mt-6 border rounded-xl divide-y">
              <div className="p-4 flex justify-between items-center bg-muted/5">
                <div>
                  <p className="font-bold">admin@skilllinkr.com</p>
                  <p className="text-xs text-muted-foreground">Super Admin</p>
                </div>
                <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 text-xs font-bold rounded">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b flex items-center gap-3 bg-muted/10">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold">Image Pipeline & Watermarks</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold">Enable Automatic Watermarking</p>
                <p className="text-sm text-muted-foreground mt-1">Automatically apply the SkillLinkr logo to all uploaded opportunity posters.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
            
            <div>
              <p className="font-bold mb-2">Watermark Opacity</p>
              <input type="range" min="10" max="100" defaultValue="50" className="w-full accent-primary" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>10%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
          <div className="p-4 border-t bg-muted/10 flex justify-end">
            <button className="px-6 py-2 bg-primary text-primary-foreground rounded-xl font-medium">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
