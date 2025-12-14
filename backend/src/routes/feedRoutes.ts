import { Router } from "express";
import { authenticate } from "../middlewares/authMiddlware.js";
import { getFeed } from "../controllers/feedController.js";

const router = Router();

router.get('/', authenticate, getFeed);

export default router;