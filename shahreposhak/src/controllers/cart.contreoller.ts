import { Request, Response } from "express";
import  Cart  from "../models/cart.model.ts"
import  Product  from "../models/ProducModel.ts"

// 🛍 اضافه کردن محصول به سبد
export const addToCart = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404).json({ message: "محصول یافت نشد." });
    return;
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = new Cart({ user: userId, items: [], totalPrice: 0 });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  cart.totalPrice = await calculateCartTotal(cart.items);
  await cart.save();

  res.status(200).json(cart);
};

// دریافت سبد خرید کاربر
export const getMyCart = async (req: Request, res: Response): Promise<void> => {
  const userId = (req as any).user.id;
  const cart = await Cart.findOne({ user: userId }).populate("items.product");
  if (!cart) {
    res.status(200).json({ items: [], totalPrice: 0 });
    return;
  }
  res.status(200).json(cart);
};

const calculateCartTotal = async (items: any[]) => {
  let total = 0;
  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) total += product.price * item.quantity;
  }
  return total;
};
