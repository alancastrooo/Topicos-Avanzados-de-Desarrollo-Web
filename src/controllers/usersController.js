import { User } from "../models/userModel.js";

export const createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    if (!name || !email ) {
      return res.status(400).json({
        error: "Faltan datos, datos esperados: 'name', 'email' ",
      });
    }
    const user = new User(req.body);
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    next(error)
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: 1 });
    res.status(200).json(users);
  } catch (error) {
    next(error)
  }
};
