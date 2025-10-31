import { PoolClient } from "pg";

export class SupplierRepository {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  async addSupplier(
    name: string,
    contact_name: string | null,
    contact_email: string | null,
    phone: string | null,
    address: string | null,
    country: string | null,
    rating: number | null,
    updated_by: number | null,
    contacts: Array<{ email: string; phone: string }> = []
  ) {
    await this.client.query(`CALL add_supplier($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [
      name,
      contact_name,
      contact_email,
      phone,
      address,
      country,
      rating,
      updated_by,
      JSON.stringify(contacts),
    ]);
  }

  async getSuppliers() {
    const result = await this.client.query(`SELECT * FROM v_active_suppliers`);
    return result.rows;
  }

  async getSupplierById(id: number) {
    const result = await this.client.query(
      `SELECT * FROM v_active_suppliers WHERE supplier_id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async updateSupplier(
    supplier_id: number,
    name: string | null,
    contact_name: string | null,
    contact_email: string | null,
    phone: string | null,
    address: string | null,
    country: string | null,
    rating: number | null,
    updated_by: number | null,
    update_contacts: Array<{ id: number; email: string; phone: string }> = [],
    new_contacts: Array<{ email: string; phone: string }> = [],
    delete_contacts: number[] = []
  ) {
    await this.client.query(
      `CALL update_supplier($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
      [
        supplier_id,
        name,
        contact_name,
        contact_email,
        phone,
        address,
        country,
        rating,
        updated_by,
        JSON.stringify(update_contacts),
        JSON.stringify(new_contacts),
        delete_contacts.length ? delete_contacts : null,
      ]
    );
  }

  async softDeleteSupplier(supplier_id: number) {
    await this.client.query(`CALL soft_delete_supplier($1)`, [supplier_id]);
  }

  async restoreSupplier(supplier_id: number) {
    await this.client.query(`CALL restore_supplier($1)`, [supplier_id]);
  }
}
