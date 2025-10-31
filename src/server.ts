import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import apiRoutes from './routes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

app.use('/api', apiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
