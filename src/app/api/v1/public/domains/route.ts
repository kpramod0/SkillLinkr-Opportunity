import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = await createAdminClient()
    
    const { data, error } = await supabase
      .from('opp_domains')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })
      
    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
