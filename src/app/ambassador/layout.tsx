import { AmbassadorSidebar } from '@/components/layout/AmbassadorSidebar'

export default function AmbassadorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AmbassadorSidebar />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
