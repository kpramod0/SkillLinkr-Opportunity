-- 006_opportunities.sql

CREATE TYPE opp_status AS ENUM (
    'draft', 'submitted', 'under_review', 'needs_correction', 
    'correction_submitted', 'approved', 'ready_for_publish', 
    'scheduled', 'published', 'live', 'expired', 'archived', 'rejected'
);

CREATE TYPE opp_priority AS ENUM ('normal', 'featured', 'trending', 'urgent');
CREATE TYPE opp_mode AS ENUM ('online', 'offline', 'hybrid');
CREATE TYPE opp_verification_type AS ENUM ('verified_society', 'verified_by_ambassador');

CREATE TABLE opp_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    society_id UUID REFERENCES opp_societies(id) ON DELETE SET NULL,
    college_id UUID NOT NULL REFERENCES opp_colleges(id) ON DELETE RESTRICT,
    category_id UUID NOT NULL REFERENCES opp_categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    organizer TEXT NOT NULL,
    
    status opp_status DEFAULT 'draft',
    priority opp_priority DEFAULT 'normal',
    is_pinned BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_trending BOOLEAN DEFAULT false,
    is_homepage_banner BOOLEAN DEFAULT false,
    
    registration_opens TIMESTAMPTZ,
    registration_closes TIMESTAMPTZ,
    event_starts TIMESTAMPTZ,
    event_ends TIMESTAMPTZ,
    result_announcement TIMESTAMPTZ,
    
    mode opp_mode,
    venue TEXT,
    maps_link TEXT,
    eligibility TEXT,
    registration_link TEXT,
    website TEXT,
    benefits JSONB,
    max_participants INTEGER,
    tags TEXT[],
    domains TEXT[],
    supporting_links JSONB,
    
    verification_type opp_verification_type,
    verified_by UUID REFERENCES opp_users(id) ON DELETE SET NULL,
    
    view_count INTEGER DEFAULT 0,
    bookmark_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    reg_click_count INTEGER DEFAULT 0,
    
    published_at TIMESTAMPTZ,
    scheduled_publish_at TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES opp_users(id) ON DELETE SET NULL,
    
    current_version INTEGER DEFAULT 1,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    archived_at TIMESTAMPTZ
);

CREATE TRIGGER update_opp_opportunities_updated_at
    BEFORE UPDATE ON opp_opportunities
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();

CREATE INDEX idx_opp_status_college_cat ON opp_opportunities(status, college_id, category_id);
CREATE INDEX idx_opp_cursor ON opp_opportunities(created_at, id);
CREATE INDEX idx_opp_tags ON opp_opportunities USING GIN(tags);
CREATE INDEX idx_opp_fts ON opp_opportunities USING GIN(to_tsvector('english', title || ' ' || short_description));
CREATE INDEX idx_opp_scheduled ON opp_opportunities(scheduled_publish_at) WHERE status = 'scheduled';
CREATE INDEX idx_opp_expire ON opp_opportunities(event_ends) WHERE status IN ('published', 'live');
CREATE INDEX idx_opp_duplicate ON opp_opportunities(society_id, title, organizer, event_starts);
CREATE INDEX idx_opp_priority ON opp_opportunities(priority, is_pinned, is_featured) WHERE status = 'published';

CREATE TABLE opp_opportunity_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID NOT NULL REFERENCES opp_opportunities(id) ON DELETE RESTRICT,
    thumbnail_url TEXT,
    medium_url TEXT,
    large_url TEXT,
    variant TEXT DEFAULT 'poster',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);
