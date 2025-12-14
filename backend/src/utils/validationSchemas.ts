import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6)
    .regex(/[A-Z]/, "Password must contain at least 1 uppercase letter")
    .regex(/[a-z]/, "Password must contain at least 1 lowercase letter")
    .regex(/[0-9]/, "Password must contain at least 1 number"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  role: z.enum(["user", "trainer"]),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

export const createPlanSchema = z.object({
  title: z.string().min(3, "Title must be atleast 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price cannot be negative"),
  duration: z.number().min(1, "Duration must be at least 1 day"),
  workoutDetails: z.any(),
});

export const updatePlanSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .optional(),
  price: z.number().min(0, "Price cannot be negative").optional(),
  duration: z.number().min(1, "Duration must be at least 1 day").optional(),
  workoutDetails: z.any().optional(),
});

export const subscribePlanSchema = z.object({
  planId: z.string().min(1, "Plan ID is required"),
});
