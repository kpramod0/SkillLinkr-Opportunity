import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    
    // Filters
    const query = searchParams.get('query')
    const categoryId = searchParams.get('category_id')
    const collegeId = searchParams.get('college_id')
    const status = searchParams.get('status') || 'published'
    
    const supabase = await createAdminClient()
    
    let dbQuery = supabase
      .from('opp_opportunities')
      .select(`
        *,
        society:opp_societies(society_name, representative_name),
        college:opp_colleges(name, code),
        category:opp_categories(name, slug),
        images:opp_opportunity_images(thumbnail_url, medium_url, large_url)
      `, { count: 'exact' })
      .eq('status', status)
      
    if (query) {
      dbQuery = dbQuery.textSearch('title', query, {
        type: 'websearch',
        config: 'english'
      })
    }
    
    if (categoryId) {
      dbQuery = dbQuery.eq('category_id', categoryId)
    }
    
    if (collegeId) {
      dbQuery = dbQuery.eq('college_id', collegeId)
    }
    
    // Order by priority first (urgent, featured, normal), then by date
    dbQuery = dbQuery
      .order('is_pinned', { ascending: false })
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)
      
    const { data, error, count } = await dbQuery
    
    if (error) {
      console.error('Error fetching opportunities:', error)
      return NextResponse.json({ error: 'Failed to fetch opportunities' }, { status: 500 })
    }
    
    return NextResponse.json({
      data,
      meta: {
        page,
        limit,
        total: count,
        totalPages: count ? Math.ceil(count / limit) : 0
      }
    })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
