CREATE OR REPLACE FUNCTION get_product_category_by_id(p_category_id INT)
RETURNS TABLE (
    category_id INT,
    name VARCHAR,
    description TEXT,
    parent_category_id INT,
    parent_category_name VARCHAR,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        pc.category_id,
        pc.name,
        pc.description,
        pc.parent_category_id,
        parent.name AS parent_category_name,
        pc.created_at
    FROM product_categories pc
    LEFT JOIN product_categories parent
        ON pc.parent_category_id = parent.category_id
        AND parent.deleted_at IS NULL
    WHERE pc.category_id = p_category_id
      AND pc.deleted_at IS NULL;
END;
$$;

CREATE OR REPLACE FUNCTION get_category_hierarchy(p_category_id INT)
RETURNS TABLE (
    category_id INT,
    name VARCHAR,
    level INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH RECURSIVE category_tree AS (
        SELECT
            pc.category_id,
            pc.name,
            pc.parent_category_id,
            0 AS level
        FROM product_categories pc
        WHERE pc.category_id = p_category_id
          AND pc.deleted_at IS NULL

        UNION ALL

        SELECT
            pc.category_id,
            pc.name,
            pc.parent_category_id,
            ct.level + 1
        FROM product_categories pc
        INNER JOIN category_tree ct
            ON pc.parent_category_id = ct.category_id
        WHERE pc.deleted_at IS NULL
    )
    SELECT ct.category_id, ct.name, ct.level
    FROM category_tree ct
    ORDER BY ct.level;
END;
$$;
