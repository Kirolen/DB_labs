import { getClient } from "./connection";
import { PoolClient } from "pg";
import { UserRepository } from "./repositories/user.repository";
import { SupplierRepository } from "./repositories/supplier.repository";
import { ProductRepository } from "./repositories/product.repository";
import { ProductCategoryRepository } from "./repositories/product_category.repository";

export class UnitOfWork {
  private client;
  public users: UserRepository;
  public suppliers: SupplierRepository;
  public products: ProductRepository;
  public productCategories: ProductCategoryRepository;

  private constructor(client: PoolClient) {
    this.client = client;
    this.users = new UserRepository(client);
    this.suppliers = new SupplierRepository(client);
    this.products = new ProductRepository(client);
    this.productCategories = new ProductCategoryRepository(client);
  }

  static async create() {
    const client = await getClient();
    await client.query("BEGIN");
    return new UnitOfWork(client);
  }

  async commit() {
    await this.client.query("COMMIT");
    this.client.release();
  }

  async rollback() {
    await this.client.query("ROLLBACK");
    this.client.release();
  }
}
