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
