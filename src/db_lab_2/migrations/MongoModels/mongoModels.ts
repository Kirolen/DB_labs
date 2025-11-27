import mongoose from "mongoose";

const ProductMetadataSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, index: true },
  attributes: { type: Object, default: {} },
  updated_at: { type: Date, default: Date.now },
}, { collection: "product_metadata" });

export const ProductMetadataModel = mongoose.model(
  "ProductMetadata",
  ProductMetadataSchema
);


const ProductReviewSchema = new mongoose.Schema({
  product_id: { type: Number, required: true, index: true },
  reviews: [
    {
      user_id: Number,
      rating: Number,
      text: String,
      images: [String],
      created_at: { type: Date, default: Date.now }
    }
  ]
}, { collection: "product_reviews" });

export const ProductReviewsModel = mongoose.model(
  "ProductReviews",
  ProductReviewSchema
);


const ActivityLogSchema = new mongoose.Schema({
  user_id: { type: Number, index: true },
  action: { type: String, required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
}, { collection: "activity_log" });

export const ActivityLogModel = mongoose.model(
  "ActivityLog",
  ActivityLogSchema
);


const RecommendationsSchema = new mongoose.Schema({
  user_id: { type: Number, index: true },
  recommended_products: [Number],
  generated_at: { type: Date, default: Date.now }
}, { collection: "recommendations" });

export const RecommendationsModel = mongoose.model(
  "Recommendations",
  RecommendationsSchema
);
