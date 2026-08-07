-- 005_categories_and_domains.sql

CREATE TABLE opp_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_opp_categories_updated_at
    BEFORE UPDATE ON opp_categories
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();

CREATE TABLE opp_domains (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TRIGGER update_opp_domains_updated_at
    BEFORE UPDATE ON opp_domains
    FOR EACH ROW
    EXECUTE FUNCTION update_opp_updated_at_column();
