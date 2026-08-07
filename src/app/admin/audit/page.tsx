"use client"

import { useState } from 'react'
import { Search, Filter, History } from 'lucide-react'

const mockLogs = [
  { id: '1', actor: 'Super Admin', action: 'BULK_PUBLISH', target: '3 Opportunities', date: '2026-08-06 10:45 AM', ip: '192.168.1.1' },
  { id: '2', actor: 'Ambassador (KIIT)', action: 'APPROVE', target: 'Opp ID: 1245', date: '2026-08-06 09:30 AM', ip: '117.198.2.1' },
  { id: '3', actor: 'Admin User', action: 'REGISTER_AMBASSADOR', target: 'User ID: 8901', date: '2026-08-05 14:20 PM', ip: '192.168.1.5' },
]

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">Immutable trail of all actions performed on the platform.</p>
        </div>
      </div>

      <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-4 justify-between bg-muted/20">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search logs by actor, action, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border bg-background text-foreground focus:ring-2 focus:ring-primary focus:outline-none transition-all"
            />
          </div>
          <div className="flex gap-2">
            <input type="date" className="px-4 py-2 rounded-xl border bg-background text-foreground text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
            <button className="flex items-center justify-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted/50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/30 border-b">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Date / Time</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Actor</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Action</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Target</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockLogs.map((log) => (
                <tr key={log.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 font-medium text-foreground">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-muted-foreground" />
                      {log.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-foreground">{log.actor}</td>
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-semibold bg-muted px-2 py-1 rounded text-foreground">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">{log.target}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{log.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t bg-muted/20 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 1 to 3 of 3 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>Previous</button>
            <button className="px-3 py-1 border rounded-lg hover:bg-muted transition-colors disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
