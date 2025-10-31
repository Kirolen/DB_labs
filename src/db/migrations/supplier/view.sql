CREATE OR REPLACE VIEW v_active_suppliers AS
SELECT s.supplier_id,
       s.name,
       s.contact_name,
       s.contact_email,
       s.phone,
       s.address,
       s.country,
       s.rating,
       s.created_at,
       s.updated_at,
       s.updated_by,
       json_agg(
           json_build_object(
               'contact_id', sc.contact_id,
               'email', sc.email,
               'phone', sc.phone,
               'created_at', sc.created_at
           )
       ) FILTER (WHERE sc.deleted_at IS NULL) AS contacts
FROM suppliers s
LEFT JOIN suppliers_contacts sc
  ON s.supplier_id = sc.supplier_id
WHERE s.deleted_at IS NULL
GROUP BY s.supplier_id
ORDER BY s.created_at DESC;