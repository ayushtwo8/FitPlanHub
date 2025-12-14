import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { Follow } from "../models/followModel.js";
import { Subscription } from "../models/subscriptionModel.js";
import { User } from "../models/userModel.js";
import { Plan } from "../models/planModel.js";

export const getFeed = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const userId = req.user?.userId;

    const follows = await Follow.find({ userId });
    const followedTrainerIds = follows.map((f) => f.trainerId);

    const plansFromFollowedTrainers = await Plan.find({
      trainerId: { $in: followedTrainerIds },
    }).sort({ createdAt: -1 });

    const mySubscriptions = await Subscription.find({
      userId,
      isActive: true,
    }).sort({ purchaseDate: -1 });

    const plansWithTrainer = await Promise.all(
      plansFromFollowedTrainers.map(async (plan) => {
        const trainer = await User.findById(plan.trainerId).select(
          "name email"
        );

        const subscription = await Subscription.findOne({
          userId,
          planId: plan._id.toString(),
          isActive: true,
        });

        return {
          id: plan._id,
          title: plan.title,
          description: plan.description,
          price: plan.price,
          duration: plan.duration,
          trainer: {
            id: trainer?._id,
            name: trainer?.name,
          },
          isSubscribed: !!subscription,
          createdAt: plan.createdAt,
        };
      })
    );

    res.json({
      followedTrainersPlans: plansWithTrainer,
      mySubscriptions: mySubscriptions.map((sub) => ({
        id: sub._id,
        plan: sub.planSnapshot,
        purchaseDate: sub.purchaseDate,
        expiryDate: sub.expiryDate,
      })),
    });
  } catch (error) {
    console.error("Get feed error:", error);
    res.status(500).json({ error: "Failed to fetch feed" });
  }
};
