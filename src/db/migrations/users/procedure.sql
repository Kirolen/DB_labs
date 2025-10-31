--- Створення користувача ---
CREATE OR REPLACE PROCEDURE add_user(
    p_username VARCHAR,
    p_email VARCHAR,
    p_password_hash VARCHAR,
    p_role VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO users(username, email, password_hash, role)
    VALUES (p_username, p_email, p_password_hash, p_role);
END;
$$;

CREATE OR REPLACE PROCEDURE update_user(
    p_user_id INT,
    p_username VARCHAR DEFAULT NULL,
    p_email VARCHAR DEFAULT NULL,
    p_password_hash VARCHAR DEFAULT NULL,
    p_role VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE users
    SET
        username = COALESCE(p_username, username),
        email = COALESCE(p_email, email),
        password_hash = COALESCE(p_password_hash, password_hash),
        role = COALESCE(p_role, role),
    WHERE user_id = p_user_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'User with ID % not found or already deleted.', p_user_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE soft_delete_user(p_user_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE users
    SET deleted_at = NOW()
    WHERE user_id = p_user_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'User with ID % not found or already deleted.', p_user_id;
    END IF;
END;
$$;
