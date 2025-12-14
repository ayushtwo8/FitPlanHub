import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import {
  createPlanSchema,
  updatePlanSchema,
} from "../utils/validationSchemas.js";
import { Plan } from "../models/planModel.js";
import { User } from "../models/userModel.js";
import { Subscription } from "../models/subscriptionModel.js";

export const getAllPlans = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });

    const plansWithTrainer = await Promise.all(
      plans.map(async (plan) => {
        const trainer = await User.findById(plan.trainerId).select(
          "name email"
        );

        let hasAccess = false;
        if (req.user) {
          const subscription = await Subscription.findOne({
            userId: req.user.userId,
            planId: plan._id.toString(),
            isActive: true,
          });
          hasAccess = !!subscription || req.user.userId === plan.trainerId;
        }

        if (hasAccess) {
          return {
            id: plan._id,
            title: plan.title,
            description: plan.description,
            price: plan.price,
            duration: plan.duration,
            workoutDetails: plan.workoutDetails,
            trainer: {
              id: trainer?._id,
              name: trainer?.name,
            },
            createdAt: plan.createdAt,
          };
        } else {
          return {
            id: plan._id,
            title: plan.title,
            price: plan.price,
            trainer: {
              id: trainer?._id,
              name: trainer?.name,
            },
            preview: true,
          };
        }
      })
    );

    res.json({ plans: plansWithTrainer });
  } catch (error) {
    console.error("Get plans error: ", error);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

export const getPlanById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    const trainer = await User.findById(plan.trainerId).select("name email");

    let hasAccess = false;
    if (req.user) {
      const subscription = await Subscription.findOne({
        userId: req.user.userId,
        planId: plan._id.toString(),
        isActive: true,
      });
      hasAccess = !!subscription || req.user.userId === plan.trainerId;
    }

    if (hasAccess) {
      res.json({
        id: plan._id,
        title: plan.title,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        workoutDetails: plan.workoutDetails,
        trainer: {
          id: trainer?._id,
          name: trainer?.name,
        },
        createdAt: plan.createdAt,
      });
    } else {
      res.json({
        plan: {
          id: plan._id,
          title: plan.title,
          price: plan.price,
          trainer: {
            id: trainer?._id,
            name: trainer?.name,
          },
          preview: true,
          message: "Subscribe to view full plan details",
        },
      });
    }
  } catch (error) {
    console.error("Get plan error: ", error);
    res.status(500).json({ error: "Failed to fetch plan" });
  }
};

export const createPlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const result = createPlanSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: result.error.message });
    return;
  }

  try {
    if (req.user?.role !== "trainer") {
      res.status(403).json({ error: "Only trainers can create plans" });
      return;
    }

    const plan = await Plan.create({
      trainerId: req.user.userId,
      ...result.data,
    });

    res.status(201).json({ message: "plan created successfully", plan });
  } catch (error) {
    res.status(500).json({ error: "Failed to create plan" });
  }
};

export const updatePlan = async (req: AuthRequest, res: Response) => {
  const result = updatePlanSchema.safeParse(req.body);

  if (!result.success) {
    res
      .status(400)
      .json({ error: "Validation failed", details: result.error.message });
    return;
  }

  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    if (plan.trainerId !== req.user?.userId) {
      res.status(403).json({ error: "You can only update your own plans" });
      return;
    }

    const updatedPlan = await Plan.findByIdAndUpdate(
      req.params.id,
      result.data,
      { new: true }
    );

    res.json({ message: "Plan updated successfully", plan: updatedPlan });
  } catch (error) {
    res.status(500).json({ error: "Failed to update plan" });
  }
};

export const deletePlan = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const plan = await Plan.findById(id);
    if (!plan) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    if (plan.trainerId !== req.user?.userId) {
      res.status(403).json({ error: "You can only delete your own plans" });
      return;
    }

    await Plan.findByIdAndDelete(id);

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Delete plan error: ", error);
    res.status(500).json({ error: "Failed to delete plan" });
  }
};
