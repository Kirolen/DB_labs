CREATE OR REPLACE VIEW v_active_users AS
SELECT 
    user_id,
    username,
    email,
    role,
    created_at,
    updated_at
FROM users
WHERE deleted_at IS NULL
ORDER BY created_at DESC;
