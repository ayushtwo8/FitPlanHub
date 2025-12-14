import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { subscribePlanSchema } from "../utils/validationSchemas.js";
import { Subscription } from "../models/subscriptionModel.js";
import { Plan } from "../models/planModel.js";
import { User } from "../models/userModel.js";

export const subscribeToPlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const result = subscribePlanSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      details: result.error.message,
    });
    return;
  }

  try {
    if (req.user?.role !== "user") {
      res.status(403).json({ error: "Only users can subscribe to plans" });
      return;
    }

    const { planId } = result.data;
    const userId = req.user.userId;

    const existingSubscription = await Subscription.findOne({
      userId,
      planId,
      isActive: true,
    });

    if (existingSubscription) {
      res
        .status(400)
        .json({ error: "You are already subscribed to this plan" });
      return;
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    const trainer = await User.findById(plan.trainerId);
    if (!trainer) {
      res.status(404).json({ error: "Trainer not found" });
      return;
    }

    const purchaseDate = new Date();
    const expiryDate = new Date(purchaseDate);
    expiryDate.setDate(expiryDate.getDate() + plan.duration);

    const subscription = await Subscription.create({
      userId,
      planId,
      planSnapshot: {
        title: plan.title,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        workoutDetails: plan.workoutDetails,
        trainerId: plan.trainerId,
        trainerName: trainer.name,
      },
      purchaseDate,
      expiryDate,
      isActive: true,
    });

    res.status(201).json({
      message: "Subscription successful",
      subscription: {
        id: subscription._id,
        plan: subscription.planSnapshot,
        purchaseDate,
        expiryDate,
      },
    });
  } catch (error) {
    console.error("Failed to create subs: ", error);
    res.status(500).json({ error: "Failed to create subscription" });
  }
};

export const getMySubscriptions = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const userId = req.user?.userId;

    const subscriptions = await Subscription.find({
      userId,
      isActive: true,
    }).sort({ purchaseDate: -1 });

    res.json({
      subscriptions: subscriptions.map((sub) => ({
        id: sub._id,
        plan: sub.planSnapshot,
        purchaseDate: sub.purchaseDate,
        expiryDate: sub.expiryDate,
        isActive: sub.isActive,
      })),
    });
  } catch (error) {
    console.error("Get subscriptions error:", error);
    res.status(500).json({ error: "Failed to fetch subscriptions" });
  }
};
