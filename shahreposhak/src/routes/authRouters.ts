import express from "express";
import { register, login, refreshToken, changePassword, updateProfile, logOut } from "../controllers/authController.ts";
import  loginLimiter  from "../middleware/loginLimiter.js";
import { verifyToken } from "../middleware/authMiddleware.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login" ,loginLimiter, login);
router.post("/refresh", refreshToken);
router.post("/change-password", verifyToken, changePassword);
router.post("/update-profile", verifyToken, updateProfile);
router.post("/logout", verifyToken, logOut);

export default router;
