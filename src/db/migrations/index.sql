CREATE INDEX IF NOT EXISTS idx_audit_log_table_time
ON audit_log (table_name, changed_at DESC);

-- GIN index для повнотекстового пошуку по JSONB полям
CREATE INDEX IF NOT EXISTS idx_audit_log_json_data
ON audit_log USING GIN (new_data, old_data);

-- Additional B-tree index для пошуку по користувачу
CREATE INDEX IF NOT EXISTS idx_audit_log_user
ON audit_log (changed_by);