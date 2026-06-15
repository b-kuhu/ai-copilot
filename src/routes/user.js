import express from 'express';
import { loginUser, logout, myProfile, refreshToken, register, verifyOtp, verifyUser,  } from '../controllers/user.js';
import { isAuth } from '../middleware/isAuth.js';

const router = express.Router();

router.post('/register', register);
router.post('/verify/:token', verifyUser);
router.post('/login', loginUser);
router.post('/verify', verifyOtp)
router.get('/me', isAuth, myProfile) // protected route to get user profile, requires authentication
router.post('/refresh-token', refreshToken) // to refresh access token using refresh token
router.post('/logout',isAuth, logout)

export default router;