-- 022_signup_fields.sql

ALTER TABLE opp_societies
ADD COLUMN github_url TEXT,
ADD COLUMN year_of_studying TEXT;
