import mongoose, { Schema } from "mongoose";
import { type IUser } from "../types/index.js";

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: { type: String, required: true },
    role: { type: String, enum: ["user", "trainer"], required: true },
  },
  {
    timestamps: true,
  }
);

// index for faster queries
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
