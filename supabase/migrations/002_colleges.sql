-- 002_colleges.sql

CREATE TABLE opp_colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    university TEXT,
    city TEXT,
    state TEXT,
    email_domain TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_opp_colleges_updated_at
    BEFORE UPDATE ON opp_colleges
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();
