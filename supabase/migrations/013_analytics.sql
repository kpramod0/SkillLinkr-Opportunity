-- 013_analytics.sql

CREATE TABLE opp_analytics_daily (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    date DATE NOT NULL,
    college_id UUID REFERENCES opp_colleges(id) ON DELETE SET NULL,
    category_id UUID REFERENCES opp_categories(id) ON DELETE SET NULL,
    metric TEXT NOT NULL,
    value INTEGER NOT NULL DEFAULT 0,
    UNIQUE(date, college_id, category_id, metric)
);

CREATE INDEX idx_opp_analytics_daily_date ON opp_analytics_daily(date);
