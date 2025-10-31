-- Функція для отримання історії змін конкретного запису
CREATE OR REPLACE FUNCTION get_record_history(
    p_table_name VARCHAR,
    p_record_id INT
)
RETURNS TABLE (
    log_id INT,
    operation VARCHAR,
    old_data JSONB,
    new_data JSONB,
    changed_by INT,
    changed_by_username VARCHAR,
    changed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.log_id,
        al.operation,
        al.old_data,
        al.new_data,
        al.changed_by,
        u.username AS changed_by_username,
        al.changed_at
    FROM audit_log al
    LEFT JOIN users u ON al.changed_by = u.user_id
    WHERE al.table_name = p_table_name
      AND al.record_id = p_record_id
    ORDER BY al.changed_at DESC;
END;
$$;

-- Функція для отримання логів за період часу
CREATE OR REPLACE FUNCTION get_audit_logs_by_period(
    p_start_date TIMESTAMPTZ,
    p_end_date TIMESTAMPTZ,
    p_table_name VARCHAR DEFAULT NULL
)
RETURNS TABLE (
    log_id INT,
    table_name VARCHAR,
    operation VARCHAR,
    record_id INT,
    changed_by_username VARCHAR,
    changed_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.log_id,
        al.table_name,
        al.operation,
        al.record_id,
        u.username AS changed_by_username,
        al.changed_at
    FROM audit_log al
    LEFT JOIN users u ON al.changed_by = u.user_id
    WHERE al.changed_at BETWEEN p_start_date AND p_end_date
      AND (p_table_name IS NULL OR al.table_name = p_table_name)
    ORDER BY al.changed_at DESC;
END;
$$;

-- Функція для отримання статистики по операціях
CREATE OR REPLACE FUNCTION get_audit_statistics(
    p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
    p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
    table_name VARCHAR,
    operation VARCHAR,
    operation_count BIGINT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        al.table_name,
        al.operation,
        COUNT(*) AS operation_count
    FROM audit_log al
    WHERE al.changed_at BETWEEN p_start_date AND p_end_date
    GROUP BY al.table_name, al.operation
    ORDER BY al.table_name, al.operation;
END;
$$;
