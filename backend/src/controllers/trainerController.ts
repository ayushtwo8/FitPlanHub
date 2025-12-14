import type { Response } from "express";
import type { AuthRequest } from "../types/index.js";
import { User } from "../models/userModel.js";
import { Plan } from "../models/planModel.js";
import { Follow } from "../models/followModel.js";

export const getAllTrainers = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const trainers = await User.find({ role: "trainer" }).select("-password");

    const trainersWithStats = await Promise.all(
      trainers.map(async (trainer) => {
        const planCount = await Plan.countDocuments({
          trainerId: trainer._id.toString(),
        });

        let isFollowing = false;
        if (req.user) {
          const follow = await Follow.findOne({
            userId: req.user.userId,
            trainerId: trainer._id.toString(),
          });
          isFollowing = !!follow;
        }

        return {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          planCount,
          isFollowing,
        };
        res.json({ trainers: trainersWithStats });
      })
    );
  } catch (error) {
    console.error("Get trainers error:", error);
    res.status(500).json({ error: "Failed to fetch trainers" });
  }
};

export const getTrainerById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!id) {
      res.status(400).json({ error: "Trainer id is required" });
      return;
    }

    const trainer = await User.findOne({ _id: id, role: "trainer" }).select(
      "-password"
    );
    if (!trainer) {
      res.status(404).json({ error: "Trainer not found" });
      return;
    }

    const plans = await Plan.find({ trainerId: id }).sort({ createdAt: -1 });

    let isFollowing = false;
    if (req.user) {
      const follow = await Follow.findOne({
        userId: req.user.userId,
        trainerId: id,
      });
      isFollowing = !!follow;
    }

    res.json({
      trainer: {
        id: trainer._id,
        name: trainer.name,
        email: trainer.email,
        isFollowing,
      },
      plans: plans.map((plan) => ({
        id: plan._id,
        title: plan.title,
        description: plan.description,
        price: plan.price,
        duration: plan.duration,
        createdAt: plan.createdAt,
      })),
    });
  } catch (error) {
    console.error("Get trainer error:", error);
    res.status(500).json({ error: "Failed to fetch trainer" });
  }
};

export const followTrainer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user || !id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const userId = req.user?.userId;

    if (userId === id) {
      res.status(400).json({ error: "You cannot follow yourself" });
      return;
    }

    const trainer = await User.findOne({ _id: id, role: "trainer" });
    if (!trainer) {
      res.status(404).json({ error: "Trainer not found" });
      return;
    }

    const existingFollow = await Follow.findOne({ userId, trainerId: id });
    if (existingFollow) {
      res.status(400).json({ error: "Already following this trainer" });
      return;
    }

    await Follow.create({ userId, trainerId: id });

    res.status(201).json({ message: "Successfully followed trainer" });
  } catch (error) {
    console.error("Follow trainer error:", error);
    res.status(500).json({ error: "Failed to follow trainer" });
  }
};

export const unfollowTrainer = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!req.user || !id) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const userId = req.user?.userId;

    const follow = await Follow.findOneAndDelete({ userId, trainerId: id });

    if (!follow) {
      res.status(404).json({ error: "You are not following this trainer" });
      return;
    }

    res.json({ message: "Successfully unfollowed trainer" });
  } catch (error) {
    console.error("Unfollow trainer error:", error);
    res.status(500).json({ error: "Failed to unfollow trainer" });
  }
};

export const getFollowingTrainers = async (
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
    const trainerIds = follows.map((f) => f.trainerId);

    const trainers = await User.find({ _id: { $in: trainerIds } }).select(
      "-password"
    );

    const trainersWithStats = await Promise.all(
      trainers.map(async (trainer) => {
        const planCount = await Plan.countDocuments({
          trainerId: trainer._id.toString(),
        });

        return {
          id: trainer._id,
          name: trainer.name,
          email: trainer.email,
          planCount,
        };
      })
    );

    res.json({ trainers: trainersWithStats });
  } catch (error) {
    console.error("Get following error:", error);
    res.status(500).json({ error: "Failed to fetch following trainers" });
  }
};
