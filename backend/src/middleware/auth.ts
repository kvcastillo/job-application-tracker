import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

type Decoded = {
  userId: string;
};

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ message: "No token" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as Decoded;

    (req as any).user = { userId: decoded.userId };

    next();
  } catch {
    return res.status(401).json({ message: "Invalid token" });
  }
}
