import express from 'express';
import chatRoutes from './routes/chatRoutes.js';
import errorHandler from './middleware/errorHandler.js';

const app = express();

app.use(express.json()); 

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/api', chatRoutes);
app.use(errorHandler)

export default app;