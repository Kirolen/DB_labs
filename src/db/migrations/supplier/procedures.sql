CREATE OR REPLACE PROCEDURE add_supplier(
    p_name VARCHAR,
    p_contact_name VARCHAR DEFAULT NULL,
    p_contact_email VARCHAR DEFAULT NULL,
    p_phone VARCHAR DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_country VARCHAR DEFAULT NULL,
    p_rating DECIMAL DEFAULT 0,
    p_updated_by INT DEFAULT NULL,
    p_contacts JSON DEFAULT '[]' 
)
LANGUAGE plpgsql
AS $$
DECLARE
    c JSON;
    _supplier_id INT;
BEGIN
    INSERT INTO suppliers(name, contact_name, contact_email, phone, address, country, rating, updated_by)
    VALUES (p_name, p_contact_name, p_contact_email, p_phone, p_address, p_country, p_rating, p_updated_by)
    RETURNING supplier_id INTO _supplier_id;

    FOR c IN SELECT * FROM json_array_elements(p_contacts)
    LOOP
        CALL add_supplier_contact(_supplier_id, c->>'email', c->>'phone');
    END LOOP;
END;
$$;

CREATE OR REPLACE PROCEDURE update_supplier(
    p_supplier_id INT,
    p_name VARCHAR DEFAULT NULL,
    p_contact_name VARCHAR DEFAULT NULL,
    p_contact_email VARCHAR DEFAULT NULL,
    p_phone VARCHAR DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_country VARCHAR DEFAULT NULL,
    p_rating DECIMAL DEFAULT NULL,
    p_updated_by INT DEFAULT NULL,
    -- Контакти
    p_update_contacts JSON DEFAULT '[]', -- масив об'єктів {id, email, phone}
    p_new_contacts JSON DEFAULT '[]',    -- масив нових контактів {email, phone}
    p_delete_contacts INT[] DEFAULT '{}' -- масив id для видалення
)
LANGUAGE plpgsql
AS $$
DECLARE
    c JSON;
    c_id INT;
BEGIN
    -- Оновлюємо самого постачальника
    UPDATE suppliers
    SET
        name = COALESCE(p_name, name),
        contact_name = COALESCE(p_contact_name, contact_name),
        contact_email = COALESCE(p_contact_email, contact_email),
        phone = COALESCE(p_phone, phone),
        address = COALESCE(p_address, address),
        country = COALESCE(p_country, country),
        rating = COALESCE(p_rating, rating),
        updated_by = COALESCE(p_updated_by, updated_by),
        updated_at = NOW()
    WHERE supplier_id = p_supplier_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Supplier with ID % not found or deleted.', p_supplier_id;
    END IF;

    -- Оновлюємо існуючі контакти
    FOR c IN SELECT * FROM json_array_elements(p_update_contacts)
    LOOP
        CALL update_supplier_contact((c->>'id')::INT, c->>'email', c->>'phone');
    END LOOP;

    -- Додаємо нові контакти
    FOR c IN SELECT * FROM json_array_elements(p_new_contacts)
    LOOP
        CALL add_supplier_contact(p_supplier_id, c->>'email', c->>'phone');
    END LOOP;

    -- Видаляємо контакти
    IF array_length(p_delete_contacts,1) > 0 THEN
        FOREACH c_id IN ARRAY p_delete_contacts
        LOOP
            CALL soft_delete_supplier_contact(c_id);
        END LOOP;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE soft_delete_supplier(
    p_supplier_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Спочатку soft delete постачальника
    UPDATE suppliers
    SET deleted_at = NOW()
    WHERE supplier_id = p_supplier_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Supplier with ID % not found or already deleted.', p_supplier_id;
        RETURN;
    END IF;

    -- Потім soft delete усіх контактів постачальника
    UPDATE suppliers_contacts
    SET deleted_at = NOW()
    WHERE supplier_id = p_supplier_id
      AND deleted_at IS NULL;

    RAISE NOTICE 'Supplier % and related contacts soft deleted.', p_supplier_id;
END;
$$;

CREATE OR REPLACE PROCEDURE restore_supplier(
    p_supplier_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    -- Відновлюємо постачальника
    UPDATE suppliers
    SET deleted_at = NULL,
        updated_at = NOW()
    WHERE supplier_id = p_supplier_id
      AND deleted_at IS NOT NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Supplier with ID % not found or is already active.', p_supplier_id;
        RETURN;
    END IF;

    -- Відновлюємо всі контакти цього постачальника
    UPDATE suppliers_contacts
    SET deleted_at = NULL,
        updated_at = NOW()
    WHERE supplier_id = p_supplier_id
      AND deleted_at IS NOT NULL;

    RAISE NOTICE 'Supplier % and related contacts restored.', p_supplier_id;
END;
$$;
