import { Router } from 'express';
import {
  ProductMetadataModel,
  ProductReviewsModel,
  ActivityLogModel,
  RecommendationsModel,
} from '../db_lab_2/migrations/MongoModels/mongoModels';

const router = Router();

/* ----------------------------
   Create Product Metadata
----------------------------- */
router.post('/metadata', async (req, res) => {
  try {
    const doc = await ProductMetadataModel.create({
      product_id: Math.floor(Math.random() * 10000),
      attributes: req.body.attributes || { random: Math.random() },
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ----------------------------
   Get Product Metadata
----------------------------- */
router.get('/metadata', async (req, res) => {
  try {
    const docs = await ProductMetadataModel.find().limit(20);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ----------------------------
   Create Activity Log
----------------------------- */
router.post('/activity', async (req, res) => {
  try {
    const doc = await ActivityLogModel.create({
      user_id: 1,
      action: req.body.action ?? 'test_action',
      details: req.body.details ?? {},
    });

    res.status(201).json(doc);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

/* ----------------------------
   Get Activity Log
----------------------------- */
router.get('/activity', async (req, res) => {
  try {
    const docs = await ActivityLogModel.find().limit(50);
    res.json(docs);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
