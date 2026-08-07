-- 001_roles_and_users.sql

CREATE TYPE opp_user_role AS ENUM ('super_admin', 'admin', 'ambassador', 'society');
CREATE TYPE opp_user_status AS ENUM ('active', 'suspended', 'pending');

CREATE TABLE opp_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role opp_user_role NOT NULL,
    status opp_user_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_opp_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_opp_users_updated_at
    BEFORE UPDATE ON opp_users
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();
