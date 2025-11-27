import { Router } from "express";
import mongoose from "mongoose";
import {
  generateActivityLog,
  generateProductMetadata,
  generateProductReviews,
  generateRecommendations,
} from "../test/performance/dataGenerator";

import {
  mongoInsert,
  mongoSelect,
  mongoDelete,
  mongoModels,
  mongoAggregate,
  mongoJoinLike,
  mongoUpdate,
} from "../test/performance/mongoTests";

import {
  sqlInsert,
  sqlSelect,
  sqlDelete,
  sqlTables,
  sqlAggregate,
  sqlJoinTest,
  sqlUpdate,
} from "../test/performance/sqlTests";

const router = Router();

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

router.get("/performance", async (req, res) => {
  try {
    console.log("\n⚡ Starting performance tests...\n");

    const results: any = {};

    for (const test of TESTS) {
      const batchId = crypto.randomUUID();
      const data = test.generator(batchId);
      const keys = data.slice(0, 10).map((d) => d.test_id);

      console.log(`=== 🚀 Testing: ${test.name} ===`);

      const sqlIns = await sqlInsert(test.table, data);
      const mongoIns = await mongoInsert(test.mongo, data);

      const sqlSel = await sqlSelect(test.table, keys);
      const mongoSel = await mongoSelect(test.mongo, keys);

      const sqlUpd = await sqlUpdate(test.table, keys);
      const mongoUpd = await mongoUpdate(test.mongo, keys);

      const sqlAgg = await sqlAggregate(test.table);
      const mongoAgg = await mongoAggregate(test.mongo);

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

      results[test.name] = row;

      console.table(row);
    }

    return res.json({
      status: "success",
      results,
    });
  } catch (err) {
    console.error("❌ Performance test failed:", err);
    return res.status(500).json({
      status: "error",
      message: "Performance testing failed",
      error: String(err),
    });
  }
});

export default router;
