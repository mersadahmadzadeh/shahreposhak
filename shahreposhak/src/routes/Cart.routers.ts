import express from "express";
import { addToCart , getMyCart } from "../controllers/cart.contreoller.ts";
import { verifyToken } from "../middleware/authMiddleware.ts";

const CartRouter = express.Router()


CartRouter.post("/AddCart" , verifyToken,addToCart )
CartRouter.get("/getCart" , verifyToken,getMyCart  )

export default CartRouter;