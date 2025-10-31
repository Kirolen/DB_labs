CREATE OR REPLACE FUNCTION search_products(p_search_term VARCHAR)
RETURNS TABLE (
    product_id INT,
    name VARCHAR,
    description TEXT,
    sku VARCHAR,
    unit_price DECIMAL,
    stock_quantity INT
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.name,
        p.description,
        p.sku,
        p.unit_price,
        p.stock_quantity
    FROM products p
    WHERE (
        p.name ILIKE '%' || p_search_term || '%'
        OR p.description ILIKE '%' || p_search_term || '%'
        OR p.sku ILIKE '%' || p_search_term || '%'
    )
    AND p.deleted_at IS NULL
    ORDER BY p.name;
END;
$$;

CREATE OR REPLACE FUNCTION get_products_needing_reorder()
RETURNS TABLE (
    product_id INT,
    name VARCHAR,
    sku VARCHAR,
    stock_quantity INT,
    reorder_level INT,
    supplier_name VARCHAR
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.name,
        p.sku,
        p.stock_quantity,
        p.reorder_level,
        s.name AS supplier_name
    FROM products p
    LEFT JOIN suppliers s
        ON p.supplier_id = s.supplier_id
        AND s.deleted_at IS NULL
    WHERE p.stock_quantity <= p.reorder_level
      AND p.deleted_at IS NULL
    ORDER BY p.stock_quantity ASC;
END;
$$;

CREATE OR REPLACE FUNCTION get_product_by_id(p_product_id INT)
RETURNS TABLE (
    product_id INT,
    name VARCHAR,
    description TEXT,
    sku VARCHAR,
    unit_price DECIMAL,
    stock_quantity INT,
    reorder_level INT,
    supplier_id INT,
    supplier_name VARCHAR,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    needs_reorder BOOLEAN
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.product_id,
        p.name,
        p.description,
        p.sku,
        p.unit_price,
        p.stock_quantity,
        p.reorder_level,
        p.supplier_id,
        s.name AS supplier_name,
        p.created_at,
        p.updated_at,
        CASE
            WHEN p.stock_quantity <= p.reorder_level THEN true
            ELSE false
        END AS needs_reorder
    FROM products p
    LEFT JOIN suppliers s
        ON p.supplier_id = s.supplier_id
        AND s.deleted_at IS NULL
    WHERE p.product_id = p_product_id
      AND p.deleted_at IS NULL;
END;
$$;

