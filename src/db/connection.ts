import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

export const getClient = async (): Promise<PoolClient> => {
  const client = await pool.connect();
  return client;
};
