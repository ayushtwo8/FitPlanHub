import mongoose, { Schema } from "mongoose";
import { type ISubscription } from "../types/index.js";

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true, ref: "User" },
  planId: { type: String, required: true, ref: "Plan" },
  planSnapshot: {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true },
    workoutDetails: { type: Schema.Types.Mixed, required: true },
    trainerId: { type: String, required: true },
    trainerName: { type: String, required: true },
  },
  purchaseDate: {
    type: Date,
    required: true,
  },
  expiryDate: {
    type: Date,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// to prevent duplicate subsciptions
subscriptionSchema.index({ userId: 1, planId: 1 });
subscriptionSchema.index({ userId: 1, isActive: 1 });

export const Subscription = mongoose.model<ISubscription>(
  "Subscription",
  subscriptionSchema
);
