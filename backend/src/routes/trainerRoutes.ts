import { Router } from "express";
import { followTrainer, getAllTrainers, getFollowingTrainers, getTrainerById, unfollowTrainer } from "../controllers/trainerController.js";
import { authenticate } from "../middlewares/authMiddlware.js";

const router = Router();

router.get('/', getAllTrainers);
router.get('/following', authenticate, getFollowingTrainers);
router.get('/:id', getTrainerById);
router.post('/:id/follow', authenticate, followTrainer);
router.delete('/:id/unfollow', authenticate, unfollowTrainer);

export default router;