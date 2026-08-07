-- 008_submissions_timeline.sql

CREATE TABLE opp_submissions_timeline (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opp_opportunities(id) ON DELETE RESTRICT,
    status opp_status NOT NULL,
    actor_id UUID REFERENCES opp_users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_opp_submissions_timeline_opp_id ON opp_submissions_timeline(opportunity_id);
