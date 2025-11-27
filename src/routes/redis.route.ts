import { Router } from "express";
import { redis } from "../lib/redis";

const router = Router();

/* =======================================================
   PRODUCT METADATA (Redis)
   ======================================================= */

// CREATE / UPDATE
router.post("/metadata/:productId", async (req, res) => {
  const { productId } = req.params;
  const metadata = req.body;

  await redis.set(`metadata:${productId}`, JSON.stringify(metadata));
  return res.json({ message: "Saved to Redis", metadata });
});

// GET
router.get("/metadata/:productId", async (req, res) => {
  const { productId } = req.params;

  const data = await redis.get(`metadata:${productId}`);
  if (!data) return res.status(404).json({ message: "Not found" });

  return res.json(JSON.parse(data));
});

// DELETE
router.delete("/metadata/:productId", async (req, res) => {
  const { productId } = req.params;

  await redis.del(`metadata:${productId}`);
  return res.json({ message: "Deleted" });
});


/* =======================================================
   RECOMMENDATIONS (Redis)
   ======================================================= */

// CREATE / UPDATE
router.post("/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;
  const recommendations = req.body;

  await redis.set(`recommend:${userId}`, JSON.stringify(recommendations));
  return res.json({ message: "Saved", recommendations });
});

// GET
router.get("/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;

  const data = await redis.get(`recommend:${userId}`);
  if (!data) return res.status(404).json({ message: "Not found" });

  return res.json(JSON.parse(data));
});

// DELETE
router.delete("/recommendations/:userId", async (req, res) => {
  const { userId } = req.params;

  await redis.del(`recommend:${userId}`);
  return res.json({ message: "Deleted" });
});

export default router;
