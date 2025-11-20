import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 دقیقه
  max: 5,
  handler: (req, res) => {
    res.status(429).json({
      success: false,
      message: "تعداد تلاش‌های ورود بیش از حد مجاز است. لطفاً بعداً دوباره تلاش کنید.",
    });
  },
  standardHeaders: true,
  legacyHeaders: false,
});
export default loginLimiter;