-- 016_admin_allowlist.sql

CREATE TABLE opp_admin_allowlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES opp_users(id) ON DELETE SET NULL,
    account_created_at TIMESTAMPTZ
);

-- We don't have update_opp_updated_at_column if we don't have updated_at, let's add updated_at
ALTER TABLE opp_admin_allowlist ADD COLUMN updated_at TIMESTAMPTZ DEFAULT now();

CREATE TRIGGER update_opp_admin_allowlist_updated_at
    BEFORE UPDATE ON opp_admin_allowlist
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();

-- Seed initial admin (update this if needed, using a placeholder for now, you should insert your actual email)
INSERT INTO opp_admin_allowlist (email, name, is_active)
VALUES ('admin@skilllinkr.com', 'Initial Admin', true)
ON CONFLICT (email) DO NOTHING;
-- 017_ambassador_invitations.sql

CREATE TYPE opp_invitation_status AS ENUM ('invited', 'active', 'suspended');

CREATE TABLE opp_ambassador_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    college_id UUID NOT NULL REFERENCES opp_colleges(id) ON DELETE RESTRICT,
    mobile_number TEXT,
    status opp_invitation_status DEFAULT 'invited',
    invited_by UUID REFERENCES opp_users(id) ON DELETE SET NULL,
    invited_at TIMESTAMPTZ DEFAULT now(),
    account_created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_opp_ambassador_invitations_updated_at
    BEFORE UPDATE ON opp_ambassador_invitations
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();

CREATE INDEX idx_opp_ambassador_invitations_email ON opp_ambassador_invitations(email);
-- 018_onboarding_fields.sql

ALTER TABLE opp_users
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

ALTER TABLE opp_ambassadors
ADD COLUMN academic_year TEXT,
ADD COLUMN graduation_year INTEGER,
ADD COLUMN branch TEXT,
ADD COLUMN course TEXT,
ADD COLUMN student_id TEXT,
ADD COLUMN linkedin_url TEXT,
ADD COLUMN photo_url TEXT,
ADD COLUMN is_society_member BOOLEAN DEFAULT false,
ADD COLUMN society_name TEXT,
ADD COLUMN society_role TEXT,
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

ALTER TABLE opp_colleges
ADD COLUMN is_active BOOLEAN DEFAULT true;
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
