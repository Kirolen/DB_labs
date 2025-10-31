-- Універсальна функція для логування змін
CREATE OR REPLACE FUNCTION log_table_changes()
RETURNS TRIGGER AS $$
DECLARE
    v_old_data JSONB;
    v_new_data JSONB;
    v_user_id INT;
BEGIN
    -- Отримуємо ID користувача з контексту сесії (якщо встановлено)
    BEGIN
        v_user_id := current_setting('app.current_user_id')::INT;
    EXCEPTION
        WHEN OTHERS THEN
            v_user_id := NULL;
    END;

    -- Для DELETE операції
    IF (TG_OP = 'DELETE') THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := NULL;

        INSERT INTO audit_log(table_name, operation, record_id, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, (OLD.*)::TEXT::INT, v_old_data, v_new_data, v_user_id, NOW());

        RETURN OLD;

    -- Для INSERT операції
    ELSIF (TG_OP = 'INSERT') THEN
        v_old_data := NULL;
        v_new_data := to_jsonb(NEW);

        INSERT INTO audit_log(table_name, operation, record_id, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, (NEW.*)::TEXT::INT, v_old_data, v_new_data, v_user_id, NOW());

        RETURN NEW;

    -- Для UPDATE операції
    ELSIF (TG_OP = 'UPDATE') THEN
        v_old_data := to_jsonb(OLD);
        v_new_data := to_jsonb(NEW);

        INSERT INTO audit_log(table_name, operation, record_id, old_data, new_data, changed_by, changed_at)
        VALUES (TG_TABLE_NAME, TG_OP, (NEW.*)::TEXT::INT, v_old_data, v_new_data, v_user_id, NOW());

        RETURN NEW;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Тригери для users
CREATE TRIGGER audit_users_changes
AFTER INSERT OR UPDATE OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для suppliers
CREATE TRIGGER audit_suppliers_changes
AFTER INSERT OR UPDATE OR DELETE ON suppliers
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для products
CREATE TRIGGER audit_products_changes
AFTER INSERT OR UPDATE OR DELETE ON products
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для product_categories
CREATE TRIGGER audit_product_categories_changes
AFTER INSERT OR UPDATE OR DELETE ON product_categories
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для customers
CREATE TRIGGER audit_customers_changes
AFTER INSERT OR UPDATE OR DELETE ON customers
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для purchase_orders
CREATE TRIGGER audit_purchase_orders_changes
AFTER INSERT OR UPDATE OR DELETE ON purchase_orders
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для sales_orders
CREATE TRIGGER audit_sales_orders_changes
AFTER INSERT OR UPDATE OR DELETE ON sales_orders
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для inventory
CREATE TRIGGER audit_inventory_changes
AFTER INSERT OR UPDATE OR DELETE ON inventory
FOR EACH ROW EXECUTE FUNCTION log_table_changes();

-- Тригери для shipments
CREATE TRIGGER audit_shipments_changes
AFTER INSERT OR UPDATE OR DELETE ON shipments
FOR EACH ROW EXECUTE FUNCTION log_table_changes();
