import { PoolClient } from "pg";

export class ProductCategoryRepository {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  async addProductCategory(
    name: string,
    description: string | null,
    parent_category_id: number | null
  ) {
    await this.client.query(`CALL add_product_category($1,$2,$3)`, [
      name,
      description,
      parent_category_id,
    ]);
  }

  async getProductCategories() {
    const result = await this.client.query(
      `SELECT * FROM v_active_product_categories`
    );
    return result.rows;
  }

  async getProductCategoryById(id: number) {
    const result = await this.client.query(
      `SELECT * FROM get_product_category_by_id($1)`,
      [id]
    );
    return result.rows[0] || null;
  }

  async getCategoryHierarchy(category_id: number) {
    const result = await this.client.query(
      `SELECT * FROM get_category_hierarchy($1)`,
      [category_id]
    );
    return result.rows;
  }

  async updateProductCategory(
    category_id: number,
    name: string | null,
    description: string | null,
    parent_category_id: number | null
  ) {
    await this.client.query(`CALL update_product_category($1,$2,$3,$4)`, [
      category_id,
      name,
      description,
      parent_category_id,
    ]);
  }

  async softDeleteProductCategory(category_id: number) {
    await this.client.query(`CALL soft_delete_product_category($1)`, [
      category_id,
    ]);
  }

  async restoreProductCategory(category_id: number) {
    await this.client.query(`CALL restore_product_category($1)`, [
      category_id,
    ]);
  }
}
