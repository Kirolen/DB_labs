import { PoolClient } from "pg";

export class UserRepository {
  private client: PoolClient;

  constructor(client: PoolClient) {
    this.client = client;
  }

  async addUser(
    username: string,
    email: string,
    password_hash: string,
    role: string
  ) {
    await this.client.query("CALL add_user($1, $2, $3, $4)", [
      username,
      email,
      password_hash,
      role,
    ]);
  }

  async updateUser(
    id: number,
    username: string,
    email: string,
    password_hash: string,
    role: string
  ) {
    await this.client.query("CALL update_user($1, $2, $3, $4, $5)", [
      id,
      username,
      email,
      password_hash,
      role,
    ]);
  }

  async getUserById(id: number) {
    const result = await this.client.query("SELECT * FROM get_user_by_id($1)", [
      id,
    ]);

    return result.rows[0] || null;
  }

  async getUsers() {
    const result = await this.client.query("SELECT * FROM v_active_users");

    return result.rows;
  }

  async softDeleteUser(id: number) {
    await this.client.query("CALL soft_delete_user($1)", [id]);
  }
}
