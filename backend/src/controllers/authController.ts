import type { Request, Response } from "express";
import { loginSchema, signupSchema } from "../utils/validationSchemas.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import type { AuthRequest, TokenPayload } from "../types/index.js";
import {
  clearAuthCookies,
  generateAccessToken,
  generateRefreshToken,
  setAuthCookies,
  verifyRefreshToken,
} from "../utils/jwtUtils.js";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      details: result.error.message,
    });
    return;
  }

  try {
    const { email, password, name, role } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role,
    });

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create user",
    });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      error: "Validation failed",
      details: result.error.message,
    });
    return;
  }

  try {
    const { email, password } = result.data;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ error: "Incorrect password" });
      return;
    }

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    setAuthCookies(res, accessToken, refreshToken);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Login failed",
    });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  clearAuthCookies(res);
  res.json({ message: "Logout successful" });
};

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      res.status(401).json({ error: "Refresh token required" });
      return;
    }

    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }

    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(401).json({ error: "Invalid refresh token" });
  }
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.user?.userId).select("-password");

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user data" });
  }
};
