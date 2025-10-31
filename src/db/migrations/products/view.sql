CREATE OR REPLACE VIEW v_active_products AS
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
    p.updated_by,
    u.username AS updated_by_username,
    CASE
        WHEN p.stock_quantity <= p.reorder_level THEN true
        ELSE false
    END AS needs_reorder,
    json_agg(
        json_build_object(
            'category_id', pc.category_id,
            'category_name', pc.name
        )
    ) FILTER (WHERE pc.category_id IS NOT NULL) AS categories
FROM products p
LEFT JOIN suppliers s
    ON p.supplier_id = s.supplier_id
    AND s.deleted_at IS NULL
LEFT JOIN users u
    ON p.updated_by = u.user_id
    AND u.deleted_at IS NULL
LEFT JOIN product_category_mapping pcm
    ON p.product_id = pcm.product_id
LEFT JOIN product_categories pc
    ON pcm.category_id = pc.category_id
    AND pc.deleted_at IS NULL
WHERE p.deleted_at IS NULL
GROUP BY p.product_id, s.name, u.username
ORDER BY p.created_at DESC;