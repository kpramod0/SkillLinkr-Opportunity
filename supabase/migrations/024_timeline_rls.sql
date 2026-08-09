-- 024_timeline_rls.sql

-- Enable RLS (already done, but safe to repeat)
ALTER TABLE opp_submissions_timeline ENABLE ROW LEVEL SECURITY;

-- 1. Anyone can view timeline for published or live opportunities
CREATE POLICY "Public can view timeline for live ops" ON opp_submissions_timeline 
FOR SELECT USING (
  opportunity_id IN (SELECT id FROM opp_opportunities WHERE status IN ('published', 'live'))
);

-- 2. Societies can view timeline for their own opportunities
CREATE POLICY "Society view own timeline" ON opp_submissions_timeline 
FOR SELECT USING (
  opportunity_id IN (SELECT id FROM opp_opportunities WHERE society_id IN (SELECT id FROM opp_societies WHERE user_id = auth.uid()))
);

-- 3. Ambassadors can view timeline for their college's opportunities
CREATE POLICY "Ambassador view college timeline" ON opp_submissions_timeline 
FOR SELECT USING (
  opportunity_id IN (SELECT id FROM opp_opportunities WHERE college_id IN (SELECT college_id FROM opp_ambassadors WHERE user_id = auth.uid()))
);

-- 4. Admins can manage everything on the timeline
CREATE POLICY "Admins manage timeline" ON opp_submissions_timeline 
FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));

-- 5. Societies can insert timeline entries for their own opportunities
CREATE POLICY "Society insert timeline" ON opp_submissions_timeline 
FOR INSERT WITH CHECK (
  opportunity_id IN (SELECT id FROM opp_opportunities WHERE society_id IN (SELECT id FROM opp_societies WHERE user_id = auth.uid()))
);

-- 6. Ambassadors can insert timeline entries for their college's opportunities
CREATE POLICY "Ambassador insert timeline" ON opp_submissions_timeline 
FOR INSERT WITH CHECK (
  opportunity_id IN (SELECT id FROM opp_opportunities WHERE college_id IN (SELECT college_id FROM opp_ambassadors WHERE user_id = auth.uid()))
);
