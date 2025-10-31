CREATE OR REPLACE PROCEDURE add_supplier_contact(
    p_supplier_id INT,
    p_email VARCHAR,
    p_phone VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO suppliers_contacts(supplier_id, email, phone)
    VALUES (p_supplier_id, p_email, p_phone);
END;
$$;

CREATE OR REPLACE PROCEDURE update_supplier_contact(
    p_contact_id INT,
    p_email VARCHAR DEFAULT NULL,
    p_phone VARCHAR DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE suppliers_contacts
    SET
        email = COALESCE(p_email, email),
        phone = COALESCE(p_phone, phone),
        updated_at = NOW()
    WHERE contact_id = p_contact_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Contact with ID % not found or deleted.', p_contact_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE soft_delete_supplier_contact(
    p_contact_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE suppliers_contacts
    SET deleted_at = NOW()
    WHERE contact_id = p_contact_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Contact with ID % not found or already deleted.', p_contact_id;
    END IF;
END;
$$;
