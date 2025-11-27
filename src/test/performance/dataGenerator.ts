import { v4 as uuid } from "uuid";

export const generateProductMetadata = (batchId: string) => {
  return Array.from({ length: 500 }, () => ({
    test_id: uuid(),
    product_id: Math.floor(Math.random() * 100000),
    attributes: {
      color: ["black", "white", "red"][Math.floor(Math.random() * 3)],
      weight: (Math.random() * 10).toFixed(2),
      power: Math.floor(Math.random() * 500)
    },
    test_batch_id: batchId
  }));
};

export const generateProductReviews = (batchId: string) => {
  return Array.from({ length: 500 }, () => ({
    test_id: uuid(),
    product_id: Math.floor(Math.random() * 100000),
    reviews: [
      {
        user_id: Math.floor(Math.random() * 1000),
        rating: Math.floor(Math.random() * 5) + 1,
        text: "This is generated review",
        images: [],
        created_at: new Date()
      }
    ],
    test_batch_id: batchId
  }));
};

export const generateActivityLog = (batchId: string) => {
  return Array.from({ length: 500 }, () => ({
    test_id: uuid(),
    user_id: Math.floor(Math.random() * 1000),
    action: "update_test",
    details: { field: "price", new_value: Math.random() * 100 },
    timestamp: new Date(),
    test_batch_id: batchId
  }));
};

export const generateRecommendations = (batchId: string) => {
  return Array.from({ length: 500 }, () => ({
    test_id: uuid(),
    user_id: Math.floor(Math.random() * 1000),
    recommended_products: [
      Math.floor(Math.random() * 10000),
      Math.floor(Math.random() * 10000)
    ],
    generated_at: new Date(),
    test_batch_id: batchId
  }));
};
