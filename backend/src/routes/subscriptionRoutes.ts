import { Router } from "express";
import { authenticate } from "../middlewares/authMiddlware.js";
import { getMySubscriptions, subscribeToPlan } from "../controllers/subscriptionController.js";

const router = Router();

router.post('/subscribe', authenticate, subscribeToPlan);
router.get('/my-subscriptions', authenticate, getMySubscriptions);

export default router;