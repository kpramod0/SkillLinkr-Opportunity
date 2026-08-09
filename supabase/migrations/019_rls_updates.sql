-- 019_rls_updates.sql

-- Enable RLS
ALTER TABLE opp_admin_allowlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_ambassador_invitations ENABLE ROW LEVEL SECURITY;

-- 1. opp_admin_allowlist
CREATE POLICY "Admins can view allowlist" ON opp_admin_allowlist 
FOR SELECT USING (public.get_user_role() IN ('super_admin', 'admin'));

-- 2. opp_ambassador_invitations
CREATE POLICY "Admins manage invitations" ON opp_ambassador_invitations 
FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

CREATE POLICY "Ambassadors can view own invitation" ON opp_ambassador_invitations 
FOR SELECT USING (email = (auth.jwt() ->> 'email'));

-- Update audit logs to let admins read them, not just super_admins (as specified in Admin Onboarding section 7)
DROP POLICY IF EXISTS "Super Admins view audit logs" ON opp_audit_logs;
CREATE POLICY "Admins view audit logs" ON opp_audit_logs 
USING (public.get_user_role() IN ('super_admin', 'admin'));
