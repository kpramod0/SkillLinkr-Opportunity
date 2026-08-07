-- 009_drafts.sql

CREATE TABLE opp_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID NOT NULL REFERENCES opp_societies(id) ON DELETE RESTRICT,
    form_data JSONB NOT NULL,
    current_step INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_opp_drafts_updated_at
    BEFORE UPDATE ON opp_drafts
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();
