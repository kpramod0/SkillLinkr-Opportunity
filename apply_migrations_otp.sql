-- 020_society_expanded_fields.sql

ALTER TABLE opp_societies
ADD COLUMN photos TEXT[],
ADD COLUMN linkedin_url TEXT,
ADD COLUMN instagram_url TEXT,
ADD COLUMN whatsapp_number TEXT;
-- 021_otp_verification.sql

CREATE TABLE opp_otp_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    otp_code TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    is_used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_opp_otp_email ON opp_otp_verifications(email);

-- Enable RLS
ALTER TABLE opp_otp_verifications ENABLE ROW LEVEL SECURITY;

-- Admins can view all OTPs
CREATE POLICY "Admins can manage OTPs" ON opp_otp_verifications 
FOR ALL USING (public.get_user_role() IN ('super_admin', 'admin'));
