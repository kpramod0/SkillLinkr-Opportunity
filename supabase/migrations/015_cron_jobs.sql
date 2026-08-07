-- 015_cron_jobs.sql
-- Enables the pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Auto-publish scheduled opportunities
SELECT cron.schedule(
    'publish-scheduled-opportunities',
    '* * * * *', -- Every minute
    $$
    UPDATE opp_opportunities 
    SET status = 'published', published_at = now() 
    WHERE status = 'scheduled' AND scheduled_publish_at <= now();
    $$
);

-- 2. Auto-expire past opportunities
SELECT cron.schedule(
    'expire-past-opportunities',
    '0 * * * *', -- Every hour
    $$
    UPDATE opp_opportunities 
    SET status = 'expired' 
    WHERE status IN ('published', 'live') AND event_ends < now();
    $$
);

-- 3. Calculate daily analytics aggregates (Run at midnight)
SELECT cron.schedule(
    'daily-analytics-aggregate',
    '0 0 * * *', -- Every day at midnight
    $$
    -- Example aggregate logic: Count new publications per college per category
    INSERT INTO opp_analytics_daily (date, college_id, category_id, metric, value)
    SELECT 
        CURRENT_DATE - 1, 
        college_id, 
        category_id, 
        'publications', 
        COUNT(*)
    FROM opp_opportunities
    WHERE DATE(published_at) = CURRENT_DATE - 1
    GROUP BY college_id, category_id
    ON CONFLICT (date, college_id, category_id, metric) DO UPDATE SET value = EXCLUDED.value;
    $$
);
