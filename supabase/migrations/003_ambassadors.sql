-- 003_ambassadors.sql

CREATE TABLE opp_ambassadors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES opp_users(id) ON DELETE RESTRICT,
    college_id UUID NOT NULL REFERENCES opp_colleges(id) ON DELETE RESTRICT,
    full_name TEXT NOT NULL,
    contact_number TEXT,
    department TEXT,
    year INTEGER,
    designation TEXT,
    start_date DATE,
    end_date DATE,
    remarks TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TRIGGER update_opp_ambassadors_updated_at
    BEFORE UPDATE ON opp_ambassadors
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();
