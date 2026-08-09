import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const supabase = await createAdminClient()

  try {
    const { data: oppUsers } = await supabase.from('opp_users').select('id, email').in('email', ['222s@kiit.ac.in', '3333@kiit.ac.in'])
    
    if (oppUsers && oppUsers.length > 0) {
      for (const user of oppUsers) {
        // Cleanup opp_societies and opp_users manually first just in case
        await supabase.from('opp_societies').delete().eq('user_id', user.id)
        await supabase.from('opp_users').delete().eq('id', user.id)
        
        const { error: delErr } = await supabase.auth.admin.deleteUser(user.id)
        if (delErr) {
          console.error(`Failed to delete ${user.email}:`, delErr)
        }
      }
    }

    return NextResponse.json({ success: true, message: "Corrupted users deleted safely!" })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 })
  }
}
