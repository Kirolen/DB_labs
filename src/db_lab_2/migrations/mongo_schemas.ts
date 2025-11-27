const ProductMetadataSchema = {
  product_id: { type: Number, required: true, index: true },
  attributes: { type: Object, default: {} },
  updated_at: { type: Date, default: Date.now }
};

const ProductReviewSchema = {
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
};

const ActivityLogSchema = {
  user_id: { type: Number, index: true },
  action: { type: String, required: true },
  details: { type: Object },
  timestamp: { type: Date, default: Date.now }
};

const RecommendationsSchema = {
  user_id: { type: Number, index: true },
  recommended_products: [Number],
  generated_at: { type: Date, default: Date.now }
};

module.exports = {
  ProductMetadataSchema,
  ProductReviewSchema,
  ActivityLogSchema,
  RecommendationsSchema
};
