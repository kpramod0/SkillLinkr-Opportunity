import { createAdminClient } from '@/lib/supabase-server'

export type AuditAction = 
  | 'CREATE' 
  | 'UPDATE' 
  | 'DELETE' 
  | 'APPROVE' 
  | 'REJECT' 
  | 'PUBLISH' 
  | 'ARCHIVE'
  | 'REQUEST_CORRECTION'
  | 'REGISTER_SOCIETY'
  | 'REGISTER_AMBASSADOR'

export async function logAudit({
  actorId,
  action,
  targetType,
  targetId,
  metadata = {},
  ipAddress
}: {
  actorId?: string
  action: AuditAction
  targetType: 'opportunity' | 'user' | 'college' | 'society' | 'ambassador'
  targetId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
}) {
  try {
    const supabase = await createAdminClient()
    
    await supabase.from('opp_audit_logs').insert({
      actor_id: actorId || null,
      action,
      target_type: targetType,
      target_id: targetId || null,
      metadata,
      ip_address: ipAddress || null
    })
    
    return true
  } catch (error: unknown) {
    console.error('Failed to log audit event:', error)
    // We don't throw here to avoid failing the main transaction if logging fails
    return false
  }
}
