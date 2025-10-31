CREATE OR REPLACE FUNCTION get_product_categories(p_product_id INT)
RETURNS TABLE (
    category_id INT,
    category_name VARCHAR,
    parent_category_id INT,
    parent_category_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.category_id,
        pc.name AS category_name,
        pc.parent_category_id,
        parent.name AS parent_category_name
    FROM product_category_mapping pcm
    INNER JOIN product_categories pc
        ON pcm.category_id = pc.category_id
    LEFT JOIN product_categories parent
        ON pc.parent_category_id = parent.category_id
        AND parent.deleted_at IS NULL
    WHERE pcm.product_id = p_product_id
      AND pc.deleted_at IS NULL
    ORDER BY pc.name;
END;
$$;

CREATE OR REPLACE FUNCTION get_category_products_count(p_category_id INT)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    product_count INT;
BEGIN
    SELECT COUNT(*)
    INTO product_count
    FROM product_category_mapping pcm
    INNER JOIN products p
        ON pcm.product_id = p.product_id
    WHERE pcm.category_id = p_category_id
      AND p.deleted_at IS NULL;

    RETURN product_count;
END;
$$;
