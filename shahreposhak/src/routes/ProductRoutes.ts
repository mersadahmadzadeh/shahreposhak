import express from "express";
import {
  getProducts,
  getProductByID,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../controllers/productController.ts";
import { verifyToken } from "../middleware/authMiddleware.ts";
import { authorizeRole } from "../middleware/authorizeRole.ts";


const ProductRouter = express.Router();


//// all requests go through this  route

ProductRouter.get("/", getProducts);
ProductRouter.get("/:id", getProductByID);
ProductRouter.post("/",verifyToken ,authorizeRole(["admin"]), createProduct);
ProductRouter.put("/:id", verifyToken ,authorizeRole(["admin"]) ,  updateProduct);
ProductRouter.delete("/:id", verifyToken ,authorizeRole(["admin"]) ,  deleteProduct);

export default ProductRouter;
