import express, { Router } from 'express';
import { signup, login, logout, forgotPassword, resetPassword, guestLogin } from '@/controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';

const router = express.Router() as any;

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);
router.post('/guest', authLimiter, guestLogin);

export default router;
