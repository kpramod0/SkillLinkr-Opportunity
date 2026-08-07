-- 004_societies.sql

CREATE TABLE opp_societies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES opp_users(id) ON DELETE RESTRICT,
    college_id UUID NOT NULL REFERENCES opp_colleges(id) ON DELETE RESTRICT,
    society_name TEXT NOT NULL,
    representative_name TEXT NOT NULL,
    contact_number TEXT,
    position TEXT,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id)
);

CREATE TRIGGER update_opp_societies_updated_at
    BEFORE UPDATE ON opp_societies
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();
