import express from 'express';
import { handleChat } from '../controllers/chatController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

router.post('/chat', validateRequest, handleChat);

export default router;