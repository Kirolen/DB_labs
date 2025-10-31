CREATE OR REPLACE PROCEDURE add_product(
    p_name VARCHAR,
    p_description TEXT DEFAULT NULL,
    p_sku VARCHAR DEFAULT NULL,
    p_unit_price DECIMAL DEFAULT 0,
    p_stock_quantity INT DEFAULT 0,
    p_reorder_level INT DEFAULT 10,
    p_supplier_id INT DEFAULT NULL,
    p_updated_by INT DEFAULT NULL,
    p_categories INT[] DEFAULT '{}'
)
LANGUAGE plpgsql
AS $$
DECLARE
    _product_id INT;
    _category_id INT;
BEGIN
    INSERT INTO products(name, description, sku, unit_price, stock_quantity, reorder_level, supplier_id, updated_by)
    VALUES (p_name, p_description, p_sku, p_unit_price, p_stock_quantity, p_reorder_level, p_supplier_id, p_updated_by)
    RETURNING product_id INTO _product_id;

    IF array_length(p_categories, 1) > 0 THEN
        FOREACH _category_id IN ARRAY p_categories
        LOOP
            INSERT INTO product_category_mapping(product_id, category_id)
            VALUES (_product_id, _category_id)
            ON CONFLICT (product_id, category_id) DO NOTHING;
        END LOOP;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE update_product(
    p_product_id INT,
    p_name VARCHAR DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_sku VARCHAR DEFAULT NULL,
    p_unit_price DECIMAL DEFAULT NULL,
    p_stock_quantity INT DEFAULT NULL,
    p_reorder_level INT DEFAULT NULL,
    p_supplier_id INT DEFAULT NULL,
    p_updated_by INT DEFAULT NULL,
    p_add_categories INT[] DEFAULT '{}',
    p_remove_categories INT[] DEFAULT '{}'
)
LANGUAGE plpgsql
AS $$
DECLARE
    _category_id INT;
BEGIN
    UPDATE products
    SET
        name = COALESCE(p_name, name),
        description = COALESCE(p_description, description),
        sku = COALESCE(p_sku, sku),
        unit_price = COALESCE(p_unit_price, unit_price),
        stock_quantity = COALESCE(p_stock_quantity, stock_quantity),
        reorder_level = COALESCE(p_reorder_level, reorder_level),
        supplier_id = COALESCE(p_supplier_id, supplier_id),
        updated_by = COALESCE(p_updated_by, updated_by),
        updated_at = NOW()
    WHERE product_id = p_product_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Product with ID % not found or deleted.', p_product_id;
        RETURN;
    END IF;

    IF array_length(p_add_categories, 1) > 0 THEN
        FOREACH _category_id IN ARRAY p_add_categories
        LOOP
            INSERT INTO product_category_mapping(product_id, category_id)
            VALUES (p_product_id, _category_id)
            ON CONFLICT (product_id, category_id) DO NOTHING;
        END LOOP;
    END IF;

    IF array_length(p_remove_categories, 1) > 0 THEN
        DELETE FROM product_category_mapping
        WHERE product_id = p_product_id
          AND category_id = ANY(p_remove_categories);
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE update_product_stock(
    p_product_id INT,
    p_quantity_change INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET stock_quantity = stock_quantity + p_quantity_change,
        updated_at = NOW()
    WHERE product_id = p_product_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Product with ID % not found or deleted.', p_product_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE soft_delete_product(
    p_product_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET deleted_at = NOW()
    WHERE product_id = p_product_id
      AND deleted_at IS NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Product with ID % not found or already deleted.', p_product_id;
    END IF;
END;
$$;

CREATE OR REPLACE PROCEDURE restore_product(
    p_product_id INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE products
    SET deleted_at = NULL,
        updated_at = NOW()
    WHERE product_id = p_product_id
      AND deleted_at IS NOT NULL;

    IF NOT FOUND THEN
        RAISE NOTICE 'Product with ID % not found or is already active.', p_product_id;
        RETURN;
    END IF;

    RAISE NOTICE 'Product % restored.', p_product_id;
END;
$$;