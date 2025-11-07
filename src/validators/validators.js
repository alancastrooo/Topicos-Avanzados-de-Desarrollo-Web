import { param } from 'express-validator';

export const idValidator = [
  param('id')
    .exists().withMessage('El parámetro id es obligatorio'),
];

export const idIntValidator = [
  param('id')
    .exists().withMessage('El parámetro id es obligatorio')
    .isInt().withMessage('El id debe ser un número entero'),
];
