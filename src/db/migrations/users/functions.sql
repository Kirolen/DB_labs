CREATE OR REPLACE FUNCTION get_user_by_id(p_user_id INT)
RETURNS TABLE (
    user_id INT,
    username VARCHAR,
    email VARCHAR,
    role VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT u.user_id, u.username, u.email, u.role, u.created_at, u.updated_at
    FROM users u
    WHERE u.user_id = p_user_id
      AND u.deleted_at IS NULL;
END;
$$;