import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/index.js";
import { verifyAccessToken } from "../utils/jwtUtils.js";

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const accessToken = req.cookies?.accessToken;

    if (!accessToken) {
      res.status(401).json({ error: "accessToken is required" });
      return;
    }

    const decoded = verifyAccessToken(accessToken);
    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};

export const authorizeTrainer = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "trainer") {
    res.status(403).json({ error: "trainer access required" });
    return;
  }

  next();
};

export const authorizeUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user?.role !== "user") {
    res.status(403).json({ error: "user access required" });
    return;
  }

  next();
};
