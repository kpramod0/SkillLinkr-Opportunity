-- 018_onboarding_fields.sql

ALTER TABLE opp_users
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

ALTER TABLE opp_ambassadors
ADD COLUMN academic_year TEXT,
ADD COLUMN graduation_year INTEGER,
ADD COLUMN branch TEXT,
ADD COLUMN course TEXT,
ADD COLUMN student_id TEXT,
ADD COLUMN linkedin_url TEXT,
ADD COLUMN photo_url TEXT,
ADD COLUMN is_society_member BOOLEAN DEFAULT false,
ADD COLUMN society_name TEXT,
ADD COLUMN society_role TEXT,
ADD COLUMN onboarding_completed BOOLEAN DEFAULT false;

ALTER TABLE opp_colleges
ADD COLUMN is_active BOOLEAN DEFAULT true;
