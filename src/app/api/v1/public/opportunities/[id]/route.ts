import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const params = await context.params
    const supabase = await createAdminClient()
    
    // Increment view count concurrently (fire and forget)
    // In production this should be batched or done via edge function
    supabase.rpc('increment_view_count', { opp_id: params.id }).then()
    
    const { data, error } = await supabase
      .from('opp_opportunities')
      .select(`
        *,
        society:opp_societies(society_name, representative_name),
        college:opp_colleges(name, code),
        category:opp_categories(name, slug),
        images:opp_opportunity_images(thumbnail_url, medium_url, large_url)
      `)
      .eq('id', params.id)
      .eq('status', 'published')
      .single()
      
    if (error || !data) {
      return NextResponse.json({ error: 'Opportunity not found' }, { status: 404 })
    }
    
    return NextResponse.json({ data })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
