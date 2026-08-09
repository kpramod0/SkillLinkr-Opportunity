-- 020_society_expanded_fields.sql

ALTER TABLE opp_societies
ADD COLUMN photos TEXT[],
ADD COLUMN linkedin_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN whatsapp_number TEXT;
