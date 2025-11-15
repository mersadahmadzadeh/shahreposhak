import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/Users.ts";
import dotenv from "dotenv";
import TokenBlackList from "../models/TokenBlackList.ts";
import { access } from "fs";
import { token } from "morgan";

dotenv.config();

// تابع کمکی برای ساخت جفت توکن‌ها
const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET!, {
    expiresIn: "15m",
  }); // توکن کوتاه‌مدت
  const refreshToken = jwt.sign(
    { id: userId },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  ); // توکن بلندمدت
  return { accessToken, refreshToken };
};

// ثبت‌نام کاربر
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "این ایمیل قبلاً ثبت شده." });
      return;
    }

    const user = new User({ name, email, password });
    await user.save();

    const tokens = generateTokens(String(user._id));

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
    console.log(error);
  }
};

// ورود کاربر
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      res.status(401).json({ message: "ایمیل یا رمز عبور اشتباه است." });
      return;
    }

    const tokens = generateTokens(String(user._id));

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken: tokens.accessToken, // فقط accessToken رو بفرست سمت فرانت
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// تغییر رمز عبور
export const changePassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    // استخراج userId از توکن JWT
    const userId = (req as any).user?.id;
    if (!userId) {
      res.status(401).json({ message: "کاربر احراز هویت نشده." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "کاربر پیدا نشد." });
      return;
    }

    // بررسی رمز فعلی
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ message: "رمز فعلی اشتباه است." });
      return;
    }

    // تنظیم و هش رمز جدید
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "رمز عبور با موفقیت تغییر کرد." });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// بروزرسانی اطلاعات کاربر
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email } = req.body;
    const userId = (req as any).user?.id;

    if (!userId) {
      res.status(401).json({ message: "کاربر احراز هویت نشده." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "کاربر پیدا نشد." });
      return;
    }

    // بررسی تکراری نبودن ایمیل
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({ message: "این ایمیل قبلاً استفاده شده." });
        return;
      }
      user.email = email;
    }

    // تغییر نام (در صورت ارسال)
    if (name) user.name = name;

    await user.save();

    res.status(200).json({
      message: "اطلاعات با موفقیت بروزرسانی شد.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// رفرش توکن
export const refreshToken = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(401).json({ message: "رفرش توکن ارسال نشده." });
      return;
    }

    jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET!,
      (err: any, decoded: any) => {
        if (err) {
          res.status(403).json({ message: "توکن نامعتبر یا منقضی شده." });
          return;
        }

        const newTokens = generateTokens(decoded.id);
        res.status(200).json(newTokens);
      }
    );
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};



export const logOut= async(req: Request, res: Response): Promise<void> => {
  try{
    const {Token} = req.body;
    if(!token){
      res.status(400).json({ message: "توکن ارسال نشده." });
      return;
    }

    const decoded:any = jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
    await TokenBlackList.create({
      token,
      userId: decoded.id,
      expiredAt: new Date(decoded.exp * 1000),
    });

    res.status(200).json({ message: "خروج با موفقیت انجام شد." });
  }catch (error: any) {
     res.status(500).json({ message: error.message });

  }
}
