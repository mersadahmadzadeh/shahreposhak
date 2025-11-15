import { Request, Response } from "express";
import Product, { IProduct } from "../models/ProducModel.ts";

//Get all Producta

export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const Products = await Product.find({});
    res.status(200).json(Products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// get peroducts by ID
export const getProductByID = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(product);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
///

//// CREATE NEW PRODUCT
export const createProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const productData: IProduct = req.body;
    const newProduct = new Product(productData);
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
// UPDATE PRODUCT
export const updateProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ message: "Product not found" });
      return;
    }
    res.status(200).json(updated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};


//DELETE PRODUCT
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const removed = await Product.findByIdAndDelete(req.params.id);
    if (!removed) {
      res.status(404).json({ message: "محصولی برای حذف پیدا نشد." });
      return;
    }
    res.status(200).json({ message: "محصول با موفقیت حذف شد." });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

