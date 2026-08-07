-- 014_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE opp_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_ambassadors ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_societies ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_opportunity_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_opportunity_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_submissions_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_search_keywords ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE opp_analytics_daily ENABLE ROW LEVEL SECURITY;

-- Helper functions to get user role
CREATE OR REPLACE FUNCTION auth.role() RETURNS text AS $$
  SELECT role FROM opp_users WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- 1. opp_users
-- Admins can view/manage all. Users can view/manage themselves.
CREATE POLICY "Users can view themselves" ON opp_users FOR SELECT USING (id = auth.uid());
CREATE POLICY "Admins can view all users" ON opp_users FOR SELECT USING (auth.role() IN ('super_admin', 'admin'));

-- 2. opp_colleges
-- Anyone can view colleges
CREATE POLICY "Public can view colleges" ON opp_colleges FOR SELECT USING (true);
CREATE POLICY "Super Admins can manage colleges" ON opp_colleges USING (auth.role() = 'super_admin');

-- 3. opp_ambassadors
-- Public can view
CREATE POLICY "Public can view ambassadors" ON opp_ambassadors FOR SELECT USING (true);
-- Ambassador can view themselves
CREATE POLICY "Ambassador can manage themselves" ON opp_ambassadors FOR UPDATE USING (user_id = auth.uid());
-- Admin manage all
CREATE POLICY "Admins manage ambassadors" ON opp_ambassadors USING (auth.role() IN ('super_admin', 'admin'));

-- 4. opp_societies
-- Public can view
CREATE POLICY "Public can view societies" ON opp_societies FOR SELECT USING (true);
-- Society can view/edit themselves
CREATE POLICY "Society can manage themselves" ON opp_societies FOR UPDATE USING (user_id = auth.uid());
-- Admin manage all
CREATE POLICY "Admins manage societies" ON opp_societies USING (auth.role() IN ('super_admin', 'admin'));

-- 5. opp_categories and opp_domains
CREATE POLICY "Public can view categories" ON opp_categories FOR SELECT USING (true);
CREATE POLICY "Admins manage categories" ON opp_categories USING (auth.role() IN ('super_admin', 'admin'));

CREATE POLICY "Public can view domains" ON opp_domains FOR SELECT USING (true);
CREATE POLICY "Admins manage domains" ON opp_domains USING (auth.role() IN ('super_admin', 'admin'));

-- 6. opp_opportunities
-- Public can view only published or live
CREATE POLICY "Public can view live opportunities" ON opp_opportunities FOR SELECT USING (status IN ('published', 'live'));
-- Society can view/manage their own
CREATE POLICY "Society manage own opportunities" ON opp_opportunities FOR ALL USING (
  society_id IN (SELECT id FROM opp_societies WHERE user_id = auth.uid())
);
-- Ambassador can view/manage opportunities for their college
CREATE POLICY "Ambassadors manage college opportunities" ON opp_opportunities FOR ALL USING (
  college_id IN (SELECT college_id FROM opp_ambassadors WHERE user_id = auth.uid())
);
-- Admins manage all
CREATE POLICY "Admins manage all opportunities" ON opp_opportunities FOR ALL USING (auth.role() IN ('super_admin', 'admin'));

-- 7. opp_opportunity_images, opp_opportunity_versions, opp_submissions_timeline, opp_corrections
-- If you can view the opportunity, you can view these (except drafts)
-- Simplified for this audit: Admin access or owner access
CREATE POLICY "Admins manage versions" ON opp_opportunity_versions USING (auth.role() IN ('super_admin', 'admin'));
CREATE POLICY "Societies view own versions" ON opp_opportunity_versions FOR SELECT USING (
  opportunity_id IN (SELECT id FROM opp_opportunities WHERE society_id IN (SELECT id FROM opp_societies WHERE user_id = auth.uid()))
);

-- 8. opp_bookmarks
CREATE POLICY "Users manage own bookmarks" ON opp_bookmarks USING (user_id = auth.uid());

-- 9. opp_interactions
CREATE POLICY "Public can insert interactions" ON opp_interactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view interactions" ON opp_interactions FOR SELECT USING (auth.role() IN ('super_admin', 'admin'));

-- 10. opp_notifications
CREATE POLICY "Users manage own notifications" ON opp_notifications USING (recipient_id = auth.uid());

-- 11. opp_audit_logs
CREATE POLICY "Super Admins view audit logs" ON opp_audit_logs USING (auth.role() = 'super_admin');
