import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.ts";
import morgan from "morgan";
import cors from "cors";
import ProductRouter from "./routes/ProductRoutes.ts";
import authRoutes from "./routes/authRouters.ts"

dotenv.config();
const app = express();
// Connect to database
connectDB();
///////

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
/////// Middleware

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", ProductRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
