import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

import {
  generateProductMetadata,
  generateProductReviews,
  generateActivityLog,
  generateRecommendations,
} from "./dataGenerator";

import {
  mongoInsert,
  mongoSelect,
  mongoDelete,
  mongoModels,
  mongoAggregate, mongoJoinLike, mongoUpdate
} from "./mongoTests";
import { sqlInsert, sqlSelect, sqlDelete, sqlTables, sqlAggregate, sqlJoinTest, sqlUpdate } from "./sqlTests";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const TESTS = [
  {
    name: "Product Metadata",
    mongo: mongoModels.metadata,
    table: sqlTables.metadata,
    generator: generateProductMetadata,
  },
  {
    name: "Product Reviews",
    mongo: mongoModels.reviews,
    table: sqlTables.reviews,
    generator: generateProductReviews,
  },
  {
    name: "Activity Log",
    mongo: mongoModels.logs,
    table: sqlTables.logs,
    generator: generateActivityLog,
  },
  {
    name: "Recommendations",
    mongo: mongoModels.recommendations,
    table: sqlTables.recommendations,
    generator: generateRecommendations,
  },
];

async function run() {
  await mongoose.connect(process.env.MONGO_URL!);

  for (const test of TESTS) {
    const batchId = crypto.randomUUID();
    const data = test.generator(batchId);
    const keys = data.slice(0, 10).map((d) => d.test_id);

    console.log(`\n=== 🚀 Testing: ${test.name} ===`);

    const sqlIns = await sqlInsert(test.table, data);
    const mongoIns = await mongoInsert(test.mongo, data);

    const sqlSel = await sqlSelect(test.table, keys);
    const mongoSel = await mongoSelect(test.mongo, keys);

    const sqlUpd = await sqlUpdate(test.table, keys);
    const mongoUpd = await mongoUpdate(test.mongo, keys);

    const sqlAgg = await sqlAggregate(test.table);
    const mongoAgg = await mongoAggregate(test.mongo);

    // JOIN only once per test type
    const sqlJoin = await sqlJoinTest();
    const mongoJoin = await mongoJoinLike();

    const sqlDel = await sqlDelete(test.table, batchId);
    const mongoDel = await mongoDelete(test.mongo, batchId);

    const row = {
      SQL: {
        insert: sqlIns,
        select: sqlSel,
        update: sqlUpd,
        aggregate: sqlAgg,
        join: sqlJoin,
        delete: sqlDel,
      },
      Mongo: {
        insert: mongoIns,
        select: mongoSel,
        update: mongoUpd,
        aggregate: mongoAgg,
        join: mongoJoin,
        delete: mongoDel,
      },
    };

    console.table(row);
  }

  process.exit(0);
}

run();
