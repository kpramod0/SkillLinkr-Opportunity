-- 012_audit_logs.sql

CREATE TABLE opp_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES opp_users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID,
    metadata JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_opp_audit_logs_created_at ON opp_audit_logs(created_at);
CREATE INDEX idx_opp_audit_logs_actor ON opp_audit_logs(actor_id);
CREATE INDEX idx_opp_audit_logs_target ON opp_audit_logs(target_type, target_id);
