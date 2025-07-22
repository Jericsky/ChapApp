import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import { connectDB } from './lib/db';

import authRoutes from './routes/auth.routes'; 
import messageRoutes from './routes/message.routes'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: [
    'http://localhost:5173',
  ],
  credentials: true
}))

app.get('/', (req, res) => {
  res.send('Server is up!');
});

app.use('/api/auth', authRoutes); 
app.use('/api/message', messageRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
