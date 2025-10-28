import { Product } from "../models/productModel.js";
import mongoose from "mongoose";

export const createProduct = async (req, res, next) => {
  try {
    const { name, category, price, stock } = req.body;

    if (!name || !category || !price || !stock) {
      const error = new Error(
        "Todos los campos son obligatorios: name, category, price y stock."
      );
      error.statusCode = 400;
      return next(error);
    }

    const newProduct = new Product({ name, category, price, stock });
    const savedProduct = await newProduct.save();

    res.status(201).json(savedProduct);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ createdAt: 1 });
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const findProduct = async (req, res, next) => {
  try {
    const { category, name } = req.query;
    const filter = {};
    if (category) filter.category = { $regex: category, $options: "i" };
    if (name) filter.name = { $regex: name, $options: "i" };

    const products = await Product.find(filter);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock } = req.body;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("ID inválido o no proporcionado.");
      err.statusCode = 400;
      throw err;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, category, price, stock },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      const error = new Error("ID inválido o no proporcionado.");
      error.statusCode = 400;
      throw error;
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      const error = new Error("Producto no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    next(error);
  }
};
