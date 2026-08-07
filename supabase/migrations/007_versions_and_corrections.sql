-- 007_versions_and_corrections.sql

CREATE TABLE opp_opportunity_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opp_opportunities(id) ON DELETE RESTRICT,
    version_number INTEGER NOT NULL,
    snapshot JSONB NOT NULL,
    changed_by UUID REFERENCES opp_users(id) ON DELETE SET NULL,
    change_summary TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(opportunity_id, version_number)
);

CREATE TABLE opp_corrections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opp_opportunities(id) ON DELETE RESTRICT,
    requested_by UUID NOT NULL REFERENCES opp_users(id) ON DELETE RESTRICT,
    field_notes JSONB NOT NULL,
    responded_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_opp_corrections_updated_at
    BEFORE UPDATE ON opp_corrections
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();
