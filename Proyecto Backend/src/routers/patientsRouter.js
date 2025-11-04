import { Router } from "express";
import { idValidator } from "../validators/validators.js";
import { createPatient, deletePatient, getPatientById, getPatients, loadPatients, updatePatient } from "../controllers/patientsController.js";
import { partialPatientValidation, patientValidation } from "../validators/patientsValidators.js";

const patientsRouter = Router();

// api_url/patients
patientsRouter.get("", getPatients);
patientsRouter.get("/:id", getPatientById);
patientsRouter.post("", patientValidation, createPatient);
patientsRouter.post("/cargar-datos", loadPatients);
patientsRouter.put("/:id", idValidator, partialPatientValidation, updatePatient);
patientsRouter.delete("/:id", idValidator, deletePatient);

export default patientsRouter;
