import { Request, Response } from "express";
import  Cart from "../models/cart.model.ts";
import { Order } from "../models/order.model.ts";

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      res.status(400).json({ message: "سبد خرید شما خالی است." });
      return;
    }

    const orderItems = cart.items.map((item: any) => ({
      product: item.product._id,
      quantity: item.quantity,
      priceAtPurchase: item.product.price,
    }));

    const totalAmount = orderItems.reduce(
      (sum, item) => sum + item.priceAtPurchase * item.quantity,
      0
    );

    const order = new Order({
      user: userId,
      items: orderItems,
      totalAmount,
      status: "pending",
      paymentMethod: req.body.paymentMethod || "online",
    });

    await order.save();

    // تخلیه‌ی سبد خرید بعد از سفارش
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(201).json({ message: "سفارش با موفقیت ثبت شد.", order });
  } catch (error: any) {
    console.error("❌ CreateOrder Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user.id;
    const orders = await Order.find({ user: userId }).populate("items.product");
    res.status(200).json(orders);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
