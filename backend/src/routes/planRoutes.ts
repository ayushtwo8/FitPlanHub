import { Router } from "express";
import { createPlan, deletePlan, getAllPlans, getPlanById, updatePlan } from "../controllers/planController.js";
import { authenticate, authorizeTrainer } from "../middlewares/authMiddlware.js";

const router = Router();

router.get('/', getAllPlans);
router.get('/:id', getPlanById);
router.post('/', authenticate, authorizeTrainer, createPlan);
router.put('/:id', authenticate, authorizeTrainer, updatePlan);
router.delete('/:id', authenticate, authorizeTrainer, deletePlan);

export default router;