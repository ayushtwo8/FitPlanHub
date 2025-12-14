import mongoose, { Schema } from "mongoose";
import { type IFollow } from "../types/index.js";

const followSchema = new Schema<IFollow>(
  {
    userId: {
      type: String,
      required: true,
      ref: "User",
    },
    trainerId: {
      type: String,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// index to prevent duplicate follows
followSchema.index({ userId: 1, trainerId: 1 }, { unique: true });
followSchema.index({ userId: 1 });
followSchema.index({ trainerId: 1 });

export const Follow = mongoose.model<IFollow>("Follow", followSchema);
