import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { initRedis } from "./lib/redis";
import apiRoutes from './routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const connectMongo = async () => {
  try {
    if (!process.env.MONGO_URL) {
      throw new Error("❌ MONGO_URL is missing in .env");
    }

    await mongoose.connect(process.env.MONGO_URL);

    console.log("🍃 MongoDB connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect MongoDB:", err);
    process.exit(1);
  }
};

connectMongo();
initRedis();

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
