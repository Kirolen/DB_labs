import { Pool } from "pg";

export const pg = new Pool({
  connectionString: process.env.POSTGRES_URL
});

export const sqlInsert = async (table: string, data: any[]) => {
  const start = performance.now();
  for (const item of data) {
    await pg.query(
      `INSERT INTO ${table} (data, test_batch_id) VALUES ($1, $2)`,
      [item, item.test_batch_id]
    );
  }
  return performance.now() - start;
};

export const sqlSelect = async (table: string, keys: string[]) => {
  const start = performance.now();
  for (const key of keys) {
    await pg.query(`SELECT * FROM ${table} WHERE data->>'test_id' = $1`, [key]);
  }
  return performance.now() - start;
};

export const sqlDelete = async (table: string, batchId: string) => {
  const start = performance.now();
  await pg.query(`DELETE FROM ${table} WHERE test_batch_id = $1`, [batchId]);
  return performance.now() - start;
};

export const sqlUpdate = async (table: string, keys: string[]) => {
  const start = performance.now();

  for (const key of keys) {
    await pg.query(
      `UPDATE ${table}
       SET data = jsonb_set(data, '{updatedField}', '"updatedValue"')
       WHERE data->>'test_id' = $1`,
      [key]
    );
  }

  return performance.now() - start;
};

export const sqlAggregate = async (table: string) => {
  const start = performance.now();

  await pg.query(
    `SELECT data->>'color' AS color, COUNT(*)
     FROM ${table}
     GROUP BY color`
  );

  return performance.now() - start;
};

export const sqlJoinTest = async () => {
  const start = performance.now();

  await pg.query(`
    SELECT *
    FROM product_metadata_test meta
    JOIN product_reviews_test reviews
      ON meta.data->>'product_id' = reviews.data->>'product_id'
    LIMIT 100;
  `);

  return performance.now() - start;
};


export const sqlTables = {
  metadata: "product_metadata_test",
  reviews: "product_reviews_test",
  logs: "activity_log_test",
  recommendations: "recommendations_test"
};
