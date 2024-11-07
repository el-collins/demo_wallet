import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: any, res: any, next: NextFunction) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Authentication token required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded as { id: string; email: string; role: string }; // Include role in the user object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
};


export const authorizeAdmin = (req: any, res: any, next: NextFunction) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};