import express from 'express';
import chatRoutes from './routes/chatRoutes.js';
import userRoutes from './routes/user.js';
import errorHandler from './middleware/errorHandler.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import {createClient} from 'redis';
import cookieParser from 'cookie-parser';
import cors from 'cors';

//connect db
dotenv.config();
await connectDB();

const redisUrl = process.env.REDIS_URL;
if(!redisUrl){
  console.log('missing url')
  process.exit(1)
}

export const redisClient = createClient({
  url: redisUrl
})
redisClient.connect().then(() => console.log('redis connected')).catch((err) => {
  console.log('redis connection error', err);
  process.exit(1);
})

const app = express();

app.use(express.json()); 
app.use(cookieParser())
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}))

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api/v1', userRoutes);
app.use('/api', chatRoutes);
app.use(errorHandler)

export default app;