import mongoose, { Schema } from "mongoose";
import { type IPlan } from "../types/index.js";

const planSchema = new Schema<IPlan>(
  {
    trainerId: { type: String, required: true, ref: "User" },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, required: true, min: 1 },
    workoutDetails: { type: Schema.Types.Mixed, required: true },
  },
  {
    timestamps: true,
  }
);

// index for faster queries
planSchema.index({ trainerId: 1 });
planSchema.index({ price: 1 });
planSchema.index({ createdAt: -1 });

export const Plan = mongoose.model<IPlan>("Plan", planSchema);
