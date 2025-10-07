import { User } from "../models/userModel.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    if (!name || !email || !age) {
      return res.status(400).json({
        error: "Faltan datos, datos esperados: 'name', 'email', 'age'",
      });
    }
    const user = new User({ name, email, age });
    const savedUser = await user.save();

    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error: "Error del servidor interno" });
    console.error(error);
  }
};

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error del servidor interno" });
    console.error(error);
  }
};
