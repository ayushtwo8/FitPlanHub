import { Router } from "express";
import rateLimit from "express-rate-limit";
import { getMe, login, logout, refreshToken, signup } from "../controllers/authController.js";
import { authenticate } from "../middlewares/authMiddlware.js";

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15*60*1000,
    max: 50,
    message: 'Too many attempts, try again later',
    standardHeaders: true,
    legacyHeaders: false
})

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);
router.get('/me', authenticate, getMe);

export default router;