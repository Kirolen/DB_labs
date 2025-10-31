CREATE OR REPLACE VIEW v_active_product_categories AS
SELECT
    pc.category_id,
    pc.name,
    pc.description,
    pc.parent_category_id,
    parent.name AS parent_category_name,
    pc.created_at,
    (
        SELECT COUNT(*)
        FROM product_categories sub
        WHERE sub.parent_category_id = pc.category_id
          AND sub.deleted_at IS NULL
    ) AS subcategories_count,
    (
        SELECT COUNT(*)
        FROM product_category_mapping pcm
        WHERE pcm.category_id = pc.category_id
    ) AS products_count
FROM product_categories pc
LEFT JOIN product_categories parent
    ON pc.parent_category_id = parent.category_id
    AND parent.deleted_at IS NULL
WHERE pc.deleted_at IS NULL
ORDER BY pc.name;
