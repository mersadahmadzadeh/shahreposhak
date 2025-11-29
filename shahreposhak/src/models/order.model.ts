import mongoose, { Document } from "mongoose";

interface IOrderedItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  priceAtPurchase: number;
}

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId;
  items: IOrderedItem[];
  totalAmount: number;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  paymentMethod: "cash" | "card" | "online";
  createdAt: Date;
}

const orderedItemSchema = new mongoose.Schema<IOrderedItem>({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true },
});

const orderSchema = new mongoose.Schema<IOrder>({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [orderedItemSchema],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "paid", "shipped", "completed", "cancelled"], default: "pending" },
  paymentMethod: { type: String, enum: ["cash", "card", "online"], default: "online" },
  createdAt: { type: Date, default: Date.now },
});

export const Order = mongoose.model<IOrder>("Order", orderSchema);
