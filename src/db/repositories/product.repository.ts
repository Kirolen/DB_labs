import { PoolClient } from "pg";

export class ProductRepository {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  async addProduct(
    name: string,
    description: string | null,
    sku: string | null,
    unit_price: number,
    stock_quantity: number,
    reorder_level: number,
    supplier_id: number | null,
    updated_by: number | null,
    categories: number[] = []
  ) {
    console.log(categories)
    await this.client.query(
      `CALL add_product($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        name,
        description,
        sku,
        unit_price,
        stock_quantity,
        reorder_level,
        supplier_id,
        updated_by,
        categories
      ]
    );
  }

  async getProducts() {
    const result = await this.client.query(`SELECT * FROM v_active_products`);
    return result.rows;
  }

  async getProductById(id: number) {
    const result = await this.client.query(
      `SELECT * FROM get_product_by_id($1)`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getProductsByCategory(category_id: number) {
    const result = await this.client.query(
      `SELECT * FROM get_products_by_category($1)`,
      [category_id]
    );
    return result.rows;
  }

  async getProductsNeedingReorder() {
    const result = await this.client.query(
      `SELECT * FROM get_products_needing_reorder()`
    );
    return result.rows;
  }

  async searchProducts(search_term: string) {
    const result = await this.client.query(
      `SELECT * FROM search_products($1)`,
      [search_term]
    );
    return result.rows;
  }

  async updateProduct(
    product_id: number,
    name: string | null,
    description: string | null,
    sku: string | null,
    unit_price: number | null,
    stock_quantity: number | null,
    reorder_level: number | null,
    supplier_id: number | null,
    updated_by: number | null,
    add_categories: number[] = [],
    remove_categories: number[] = []
  ) {
    await this.client.query(
      `CALL update_product($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)`,
      [
        product_id,
        name,
        description,
        sku,
        unit_price,
        stock_quantity,
        reorder_level,
        supplier_id,
        updated_by,
        add_categories.length ? add_categories : null,
        remove_categories.length ? remove_categories : null,
      ]
    );
  }

  async updateProductStock(product_id: number, quantity_change: number) {
    await this.client.query(`CALL update_product_stock($1,$2)`, [
      product_id,
      quantity_change,
    ]);
  }

  async softDeleteProduct(product_id: number) {
    await this.client.query(`CALL soft_delete_product($1)`, [product_id]);
  }

  async restoreProduct(product_id: number) {
    await this.client.query(`CALL restore_product($1)`, [product_id]);
  }
}
