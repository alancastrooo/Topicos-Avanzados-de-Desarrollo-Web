import { body } from "express-validator";

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const registerValidator = [
  body("name").notEmpty().withMessage("El nombre es obligatorio"),
  body("email")
    .isEmail()
    .withMessage("El correo electrónico no es válido")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];
