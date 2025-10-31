CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
    supplier_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    contact_name VARCHAR(100),
    contact_email VARCHAR(150),
    phone VARCHAR(50),
    address TEXT,
    country VARCHAR(100),
    rating DECIMAL(3,2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INT REFERENCES users(user_id),
    deleted_at TIMESTAMPTZ NULL
);

CREATE TABLE IF NOT EXISTS suppliers_contacts (
    contact_id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    email VARCHAR(150),
    phone VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- 3. Категорії товарів (з soft delete)
CREATE TABLE IF NOT EXISTS product_categories (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id INT REFERENCES product_categories(category_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ NULL
);

-- 4. Товари (з soft delete та tracking)
CREATE TABLE IF NOT EXISTS products (
    product_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    sku VARCHAR(100) UNIQUE,
    unit_price DECIMAL(10,2) NOT NULL,
    stock_quantity INT DEFAULT 0,
    reorder_level INT DEFAULT 10,
    supplier_id INT REFERENCES suppliers(supplier_id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    updated_by INT REFERENCES users(user_id),
    deleted_at TIMESTAMPTZ NULL
);

-- 5. Зв'язок товарів із категоріями (багато до багатьох)
CREATE TABLE IF NOT EXISTS product_category_mapping (
    mapping_id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    category_id INT REFERENCES product_categories(category_id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(product_id, category_id)
);

-- 6. Склади
CREATE TABLE warehouses (
    warehouse_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    location VARCHAR(255),
    capacity INT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. Запаси на складах
CREATE TABLE inventory (
    inventory_id SERIAL PRIMARY KEY,
    warehouse_id INT REFERENCES warehouses(warehouse_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id) ON DELETE CASCADE,
    quantity INT DEFAULT 0,
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INT REFERENCES users(user_id)
);

-- 8. Замовлення на закупівлю
CREATE TABLE purchase_orders (
    po_id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(supplier_id),
    order_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INT REFERENCES users(user_id)
);

-- 9. Товари в замовленні постачальнику
CREATE TABLE purchase_order_items (
    po_item_id SERIAL PRIMARY KEY,
    po_id INT REFERENCES purchase_orders(po_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- 10. Клієнти
CREATE TABLE customers (
    customer_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(50),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP NULL
);

-- 11. Замовлення клієнтів
CREATE TABLE sales_orders (
    so_id SERIAL PRIMARY KEY,
    customer_id INT REFERENCES customers(customer_id),
    order_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INT REFERENCES users(user_id)
);

-- 12. Товари в замовленні клієнта
CREATE TABLE sales_order_items (
    so_item_id SERIAL PRIMARY KEY,
    so_id INT REFERENCES sales_orders(so_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL
);

-- 13. Відвантаження
CREATE TABLE shipments (
    shipment_id SERIAL PRIMARY KEY,
    so_id INT REFERENCES sales_orders(so_id),
    po_id INT REFERENCES purchase_orders(po_id),
    warehouse_id INT REFERENCES warehouses(warehouse_id),
    shipped_date DATE,
    delivery_date DATE,
    status VARCHAR(50) DEFAULT 'in_progress',
    updated_at TIMESTAMP DEFAULT NOW(),
    updated_by INT REFERENCES users(user_id)
);

-- 14. Товари у відвантаженні
CREATE TABLE shipment_items (
    shipment_item_id SERIAL PRIMARY KEY,
    shipment_id INT REFERENCES shipments(shipment_id) ON DELETE CASCADE,
    product_id INT REFERENCES products(product_id),
    quantity INT NOT NULL
);

-- 15. Додаткові контакти постачальників
CREATE TABLE suppliers_contacts (
    contact_id SERIAL PRIMARY KEY,
    supplier_id INT REFERENCES suppliers(supplier_id) ON DELETE CASCADE,
    name VARCHAR(100),
    email VARCHAR(150),
    phone VARCHAR(50),
    deleted_at TIMESTAMP NULL
);

-- Logs --
CREATE TABLE IF NOT EXISTS audit_log (
    log_id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
    record_id INT,
    old_data JSONB,
    new_data JSONB,
    changed_by INT REFERENCES users(user_id),
    changed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    ip_address INET
);
