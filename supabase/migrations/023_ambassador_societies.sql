-- 023_ambassador_societies.sql

ALTER TABLE opp_ambassadors
ADD COLUMN societies JSONB DEFAULT '[]'::jsonb;

-- Migrate existing data (if any)
UPDATE opp_ambassadors
SET societies = jsonb_build_array(
  jsonb_build_object(
    'society_name', society_name,
    'society_role', society_role
  )
)
WHERE is_society_member = true AND society_name IS NOT NULL;
