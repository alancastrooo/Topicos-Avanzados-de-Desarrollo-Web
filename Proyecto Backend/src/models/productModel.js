import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: String,
    price: Number,
    stock: Number,
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
