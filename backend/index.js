import process from 'process';
import express, { json } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import authRoutes from './routes/auth.js';

// Load environment variables
config();

const app = express();

// Middleware
app.use(cors());
app.use(json());

// Routes
app.use('/api', authRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
