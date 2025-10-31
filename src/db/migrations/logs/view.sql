-- View для зручного перегляду audit логів з інформацією про користувача
CREATE OR REPLACE VIEW v_audit_log_with_user AS
SELECT
    al.log_id,
    al.table_name,
    al.operation,
    al.record_id,
    al.old_data,
    al.new_data,
    al.changed_by,
    u.username AS changed_by_username,
    u.email AS changed_by_email,
    al.changed_at,
    al.ip_address
FROM audit_log al
LEFT JOIN users u ON al.changed_by = u.user_id
ORDER BY al.changed_at DESC;
