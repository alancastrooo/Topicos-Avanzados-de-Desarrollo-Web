import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

/**
 * Función auxiliar que genera el token y formatea la respuesta del usuario
 * @param {Object} user - Documento del usuario de MongoDB
 * @returns {Object} objeto con token y datos públicos del usuario
 */
const generateUserResponse = (user) => {
  // Crear token JWT
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  // Retornar estructura unificada
  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};


/**
 * @desc Iniciar sesión
 * @route POST /api/auth/login
 */
export const login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Datos inválidos");
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      const err = new Error("Correo o contraseña incorrectos");
      err.statusCode = 400;
      throw err;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      const err = new Error("Correo o contraseña incorrectos");
      err.statusCode = 400;
      throw err;
    }

    respuesta = generateUserResponse(user)

    res.status(200).json(respuesta);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Registrar nuevo usuario
 * @route POST /api/auth/register
 */
export const register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Datos inválidos");
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        const err = new Error("El correo electrónico ya está registrado");
      err.statusCode = 400;
      throw err;
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    respuesta = generateUserResponse(newUser)
    
    res.status(201).json(respuesta);
  } catch (error) {
    next(error);
  }
};

export const checkStatus = async (req, res, next) => {
  try {
    // ⚠️ Este endpoint requiere un middleware de autenticación que
    // decodifique el JWT y adjunte el usuario a req.user
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return next({
        status: 404,
        message: "Usuario no encontrado",
      });
    }

    respuesta = generateUserResponse(user)

    res.status(200).json(respuesta);
  } catch (error) {
    next(error);
  }
};
