import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];
  console.log("🔎 Authorization Header:", req.headers["authorization"]);

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "توکن ارسال نشده." });  
    return;
  }
  jwt.verify(token, process.env.JWT_SECRET!, (err: any, decoded: any) => {
    if (err) {
      res.status(403).json({ message: "توکن نامعتبر است." });
      return;
    }
    (req as any).user = decoded;
    next();
  });
};
