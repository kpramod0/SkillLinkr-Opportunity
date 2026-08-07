-- 010_bookmarks_and_interactions.sql

CREATE TABLE opp_bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email TEXT NOT NULL,
    opportunity_id UUID NOT NULL REFERENCES opp_opportunities(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_email, opportunity_id)
);

CREATE TYPE opp_interaction_type AS ENUM ('view', 'share', 'reg_click');

CREATE TABLE opp_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opp_opportunities(id) ON DELETE RESTRICT,
    type opp_interaction_type NOT NULL,
    user_email TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_interactions ON opp_interactions(opportunity_id, type);

CREATE TABLE opp_search_keywords (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    keyword TEXT NOT NULL UNIQUE,
    search_count INTEGER DEFAULT 1,
    last_searched_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_keywords ON opp_search_keywords(keyword, search_count DESC);
