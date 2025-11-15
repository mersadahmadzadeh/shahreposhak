import express from "express";
import { register, login, refreshToken, changePassword, updateProfile } from "../controllers/authController.ts";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/change-password", changePassword);
router.post("/update-profile", updateProfile);

export default router;
