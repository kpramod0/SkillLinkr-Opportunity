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
