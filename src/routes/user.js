import express from 'express';
import { register, verifyUser,  } from '../controllers/user.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify/:token', verifyUser);

export default router;