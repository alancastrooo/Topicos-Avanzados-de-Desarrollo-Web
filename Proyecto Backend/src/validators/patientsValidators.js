import { body } from "express-validator";

export const patientValidation = [
  body("nombre")
    .notEmpty().withMessage("El nombre es obligatorio")
    .isString().withMessage("El nombre debe ser una cadena"),
  body("apellido")
    .notEmpty().withMessage("El apellido es obligatorio")
    .isString().withMessage("El apellido debe ser una cadena"),
  body("edad")
    .notEmpty().withMessage("La edad es obligatoria")
    .isInt({ min: 0 }).withMessage("La edad debe ser un número positivo"),
  body("genero")
    .notEmpty().withMessage("El género es obligatorio")
    .isIn(["Masculino", "Femenino", "Otro"]).withMessage("Género inválido"),
  body("diagnostico")
    .notEmpty().withMessage("El diagnóstico es obligatorio")
    .isString().withMessage("El diagnóstico debe ser una cadena"),
];

export const partialPatientValidation = [
  body("nombre")
    .optional()
    .isString().withMessage("El nombre debe ser una cadena"),
  body("apellido")
    .optional()
    .isString().withMessage("El apellido debe ser una cadena"),
  body("edad")
    .optional()
    .isInt({ min: 0 }).withMessage("La edad debe ser un número positivo"),
  body("genero")
    .optional()
    .isIn(["Masculino", "Femenino", "Otro"]).withMessage("Género inválido"),
  body("diagnostico")
    .optional()
    .isString().withMessage("El diagnóstico debe ser una cadena"),
];