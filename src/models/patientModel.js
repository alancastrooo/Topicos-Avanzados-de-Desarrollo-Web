import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true,
  },
  apellido: {
    type: String,
    required: true,
    trim: true,
  },
  edad: {
    type: Number,
    required: true,
    min: 0,
  },
  genero: {
    type: String,
    enum: ["Masculino", "Femenino", "Otro"],
    required: true,
  },
  diagnostico: {
    type: String,
    required: true,
    trim: true,
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
});

export const Patient = mongoose.model("Patient", patientSchema);