import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createAdminClient()
    
    // Check DB connection
    const { error } = await supabase.from('opp_categories').select('id').limit(1)
    
    const isDbConnected = !error
    
    return NextResponse.json({
      status: isDbConnected ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      services: {
        database: isDbConnected ? 'up' : 'down',
        // Example check for Redis/Cache if implemented
        // cache: 'up',
      },
      version: process.env.npm_package_version || '1.0.0'
    }, { status: isDbConnected ? 200 : 503 })
  } catch (error: unknown) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 })
  }
}
