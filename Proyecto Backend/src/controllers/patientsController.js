import { Patient } from "../models/patientModel.js";
import { validationResult } from "express-validator";

export const getPatients = async (_req, res, next) => {
  try {
    const patients = await Patient.find();

    if (!patients.length) {
      const err = new Error("No se encontraron pacientes");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(patients);
  } catch (error) {
    next(error);
  }
};

export const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      const err = new Error("Paciente no encontrado");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};

export const createPatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Datos inválidos");
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    const newPatient = new Patient(req.body);
    await newPatient.save();

    res
      .status(201)
      .json({ message: "Paciente creado exitosamente", data: newPatient });
  } catch (error) {
    next(error);
  }
};

export const loadPatients = async (_req, res, next) => {
  try {
    const pacientesEjemplo = [
      {
        nombre: "Juan",
        apellido: "Pérez",
        edad: 35,
        genero: "Masculino",
        diagnostico: "Hipertensión arterial",
      },
      {
        nombre: "María",
        apellido: "López",
        edad: 42,
        genero: "Femenino",
        diagnostico: "Diabetes tipo 2",
      },
      {
        nombre: "Carlos",
        apellido: "Ramírez",
        edad: 29,
        genero: "Masculino",
        diagnostico: "Asma leve",
      },
      {
        nombre: "Lucía",
        apellido: "Martínez",
        edad: 50,
        genero: "Femenino",
        diagnostico: "Colesterol alto",
      },
      {
        nombre: "Andrés",
        apellido: "Gómez",
        edad: 60,
        genero: "Masculino",
        diagnostico: "Artritis reumatoide",
      },
    ];

    // Verificar si ya existen pacientes
    const count = await Paciente.countDocuments();
    if (count > 0) {
      const err = new Error("Ya existen pacientes en la base de datos");
      err.statusCode = 409; // conflicto
      throw err;
    }

    // Insertar pacientes
    const result = await Paciente.insertMany(pacientesEjemplo);

    res.status(201).json({
      message: "Pacientes cargados correctamente",
      total: result.length,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const updatePatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const err = new Error("Datos inválidos");
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    // Solo tomamos los campos que vengan en el body
    const camposActualizados = {};
    const camposPermitidos = [
      "nombre",
      "apellido",
      "edad",
      "genero",
      "diagnostico",
    ];

    camposPermitidos.forEach((campo) => {
      if (req.body[campo] !== undefined) {
        camposActualizados[campo] = req.body[campo];
      }
    });

    if (Object.keys(camposActualizados).length === 0) {
      const err = new Error(
        "No se proporcionaron campos válidos para actualizar"
      );
      err.statusCode = 400;
      throw err;
    }

    const pacienteActualizado = await Paciente.findByIdAndUpdate(
      req.params.id,
      { $set: camposActualizados },
      { new: true, runValidators: true }
    );

    if (!pacienteActualizado) {
      const err = new Error("Paciente no encontrado");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json({
      message: "Paciente actualizado parcialmente",
      data: pacienteActualizado,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePatient = async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      const err = new Error("Datos inválidos");
      err.statusCode = 400;
      err.details = errors.array();
      throw err;
    }

    const patient = await Patient.findByIdAndDelete(req.params.id);

    if (!patient) {
      const err = new Error("Paciente no encontrado");
      err.statusCode = 404;
      throw err;
    }

    res.status(200).json(patient);
  } catch (error) {
    next(error);
  }
};
