import Link from "next/link"
import { ArrowRight, Globe, ShieldCheck, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 flex flex-col font-sans selection:bg-emerald-500/30">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-cyan-400">
                SkillLinkr
              </span>
              <span className="text-xl font-semibold text-slate-300">OMS</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Log in
              </Link>
              <Link href="/signup" className="text-sm font-medium bg-white text-slate-950 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 relative overflow-hidden">
        
        {/* Background Gradients */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500 rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-sm font-medium text-slate-300 mb-8">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            SkillLinkr Opportunities Management System v1.0
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Centralize your <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 animate-gradient-x">
              campus opportunities
            </span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            The dedicated platform for university societies and campus ambassadors to create, review, and publish opportunities seamlessly to the main SkillLinkr app.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-lg hover:opacity-90 transition-opacity">
              Start Publishing
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/login" className="w-full sm:w-auto flex items-center justify-center px-8 py-4 rounded-xl bg-slate-900 border border-slate-800 text-white font-medium text-lg hover:bg-slate-800 transition-colors">
              Access Dashboard
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 mt-32 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                <Globe className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">Society Portals</h3>
              <p className="text-slate-400 leading-relaxed">
                Dedicated dashboards for university societies to draft, manage, and submit opportunities directly to their Campus Ambassadors.
              </p>
            </div>
            
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 border border-cyan-500/20">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">Ambassador Reviews</h3>
              <p className="text-slate-400 leading-relaxed">
                Streamlined verification workflows for Campus Ambassadors to ensure quality and relevance before auto-publishing.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 border border-purple-500/20">
                <Zap className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">Instant Sync</h3>
              <p className="text-slate-400 leading-relaxed">
                Once approved, opportunities are immediately synchronized and distributed across the main SkillLinkr student application.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-200">SkillLinkr</span>
            <span className="text-sm text-slate-500">© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-slate-200 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-200 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
