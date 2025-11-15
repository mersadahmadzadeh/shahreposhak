import { Schema, model, Document } from "mongoose";

// Interface برای TypeScript type checking
export interface IProduct extends Document {
  name: string;
  price: number;
  material: string;
  size: string[];
  description: string;
  dimensions: string;
  color: string[];
  inStock: boolean;
  quantity: number;
  category: string;
  images: string[];
  discount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ساختار اصلی Schema
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    material: { type: String, required: true, trim: true },
    size: { type: [String], required: true },
    description: { type: String, default: "" },
    dimensions: { type: String, default: "" },
    color: { type: [String], default: [] },
    inStock: { type: Boolean, default: true },
    quantity: { type: Number, default: 0 },
    category: { type: String, required: true },
    images: { type: [String], default: [] },
    discount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = model<IProduct>("Product", productSchema);
export default Product;
