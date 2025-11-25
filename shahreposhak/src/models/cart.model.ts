import mongoose from "mongoose";

export interface IcartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface Icart extends Document {
  user: mongoose.Types.ObjectId;
  items: IcartItem[];
  totalPrice: number;
}

const cartItemSchema = new mongoose.Schema<IcartItem>(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: { type: Number, required: true, min: 1 },
  },
  { timestamps: true }
);

const cartSchema = new mongoose.Schema<Icart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: { type: [cartItemSchema], required: true },
    totalPrice: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const cart = mongoose.model<Icart>("Cart", cartSchema);

export default cart;
