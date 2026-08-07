-- 011_notifications.sql

CREATE TYPE opp_notification_channel AS ENUM ('in_app', 'email', 'push', 'whatsapp');

CREATE TABLE opp_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_id UUID NOT NULL REFERENCES opp_users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    channel opp_notification_channel DEFAULT 'in_app',
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    metadata JSONB,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_opp_notifications_recipient ON opp_notifications(recipient_id, read_at);
