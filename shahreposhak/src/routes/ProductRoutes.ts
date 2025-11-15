import express from "express";
import {
  getProducts,
  getProductByID,
  deleteProduct,
  updateProduct,
  createProduct,
} from "../controllers/productController.ts";


const ProductRouter = express.Router();


//// all requests go through this  route

ProductRouter.get("/", getProducts);
ProductRouter.get("/:id", getProductByID);
ProductRouter.post("/", createProduct);
ProductRouter.put("/:id", updateProduct);
ProductRouter.delete("/:id", deleteProduct);

export default ProductRouter;
