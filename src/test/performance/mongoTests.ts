import {
  ProductMetadataModel,
  ProductReviewsModel,
  ActivityLogModel,
  RecommendationsModel
} from "../../db_lab_2/migrations/MongoModels/mongoModels";

export const mongoInsert = async (model: any, data: any[]) => {
  const start = performance.now();
  await model.insertMany(data);
  return performance.now() - start;
};

export const mongoSelect = async (model: any, keys: string[]) => {
  const start = performance.now();
  for (const key of keys) {
    await model.findOne({ test_id: key });
  }
  return performance.now() - start;
};

export const mongoDelete = async (model: any, batchId: string) => {
  const start = performance.now();
  await model.deleteMany({ test_batch_id: batchId });
  return performance.now() - start;
};

export const mongoUpdate = async (model: any, keys: string[]) => {
  const start = performance.now();

  for (const key of keys) {
    await model.updateOne(
      { test_id: key },
      { $set: { "attributes.updatedField": "updatedValue" } }
    );
  }

  return performance.now() - start;
};

export const mongoAggregate = async (model: any) => {
  const start = performance.now();

  await model.aggregate([
    { $group: { _id: "$attributes.color", total: { $sum: 1 } } }
  ]);

  return performance.now() - start;
};

export const mongoJoinLike = async () => {
  const start = performance.now();

  // simulate JOIN using $lookup
  await mongoModels.metadata.aggregate([
    {
      $lookup: {
        from: "product_reviews",
        localField: "product_id",
        foreignField: "product_id",
        as: "reviews_joined"
      }
    },
    { $limit: 100 }
  ]);

  return performance.now() - start;
};

export const mongoModels = {
  metadata: ProductMetadataModel,
  reviews: ProductReviewsModel,
  logs: ActivityLogModel,
  recommendations: RecommendationsModel
};
