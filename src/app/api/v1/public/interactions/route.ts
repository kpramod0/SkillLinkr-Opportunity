import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'
import { z } from 'zod'

const InteractionSchema = z.object({
  opportunityId: z.string().uuid(),
  type: z.enum(['view', 'share', 'reg_click']),
  userEmail: z.string().email().optional(),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Zod validation
    const result = InteractionSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: result.error.format() }, 
        { status: 400 }
      )
    }
    
    const { opportunityId, type, userEmail } = result.data
    
    const supabase = await createAdminClient()
    
    // Log the interaction
    await supabase.from('opp_interactions').insert({
      opportunity_id: opportunityId,
      type,
      user_email: userEmail || null
    })
    
    // Increment specific counters on the opportunity
    let rpcFunction = ''
    switch(type) {
      case 'view': rpcFunction = 'increment_view_count'; break;
      case 'share': rpcFunction = 'increment_share_count'; break;
      case 'reg_click': rpcFunction = 'increment_reg_click_count'; break;
    }
    
    if (rpcFunction) {
      await supabase.rpc(rpcFunction, { opp_id: opportunityId })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 })
  }
}
