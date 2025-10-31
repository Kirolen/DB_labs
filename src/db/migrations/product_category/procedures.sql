CREATE OR REPLACE PROCEDURE add_product_category(
    p_name VARCHAR,
    p_description TEXT DEFAULT NULL,
    p_parent_category_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO product_categories(name, description, parent_category_id)
    VALUES (p_name, p_description, p_parent_category_id);
END;
$$;

CREATE OR REPLACE PROCEDURE update_product_category(
    p_category_id INT,
    p_name VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_parent_category_id INT DEFAULT NULL
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE product_categories
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        parent_category_id = COALESCE(p_parent_category_id, parent_category_id)
    WHERE category_id = p_category_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Product category with ID % not found or already deleted.', p_category_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE soft_delete_product_category(
    p_category_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE product_categories
    SET deleted_at = NOW()
    WHERE category_id = p_category_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Product category with ID % not found or already deleted.', p_category_id;
        RETURN;
    END IF;

    UPDATE product_categories
    SET deleted_at = NOW()
    WHERE parent_category_id = p_category_id
      AND deleted_at IS NULL;

    RAISE NOTICE 'Product category % and subcategories soft deleted.', p_category_id;
END;
$$;

CREATE OR REPLACE PROCEDURE restore_product_category(
    p_category_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE product_categories
    SET deleted_at = NULL
    WHERE category_id = p_category_id
      AND deleted_at IS NOT NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Product category with ID % not found or is already active.', p_category_id;
        RETURN;
    END IF;

    UPDATE product_categories
    SET deleted_at = NULL
    WHERE parent_category_id = p_category_id
      AND deleted_at IS NOT NULL;

    RAISE NOTICE 'Product category % and subcategories restored.', p_category_id;
END;
$$;
