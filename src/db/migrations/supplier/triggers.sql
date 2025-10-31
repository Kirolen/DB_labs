CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_suppliers_updated_at
BEFORE UPDATE ON suppliers
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_suppliers_contacts_updated_at
BEFORE UPDATE ON suppliers_contacts
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();