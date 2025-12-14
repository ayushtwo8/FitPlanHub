import type { Document } from "mongoose";
import { type Request } from "express";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: "user" | "trainer";
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlan extends Document {
  trainerId: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  workoutDetails: any;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubscription extends Document {
  userId: string;
  planId: string;
  planSnapshot: {
    title: string;
    description: string;
    price: number;
    duration: number;
    workoutDetails: any;
    trainerId: string;
    trainerName: string;
  };
  purchaseDate: Date;
  expiryDate: Date;
  isActive: boolean;
}

export interface IFollow extends Document {
  userId: string;
  trainerId: string;
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: "user" | "trainer";
  };
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: "user" | "trainer";
}
