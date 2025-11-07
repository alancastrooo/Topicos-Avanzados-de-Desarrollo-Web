import { Router } from "express";
import { idValidator } from "../validators/validators.js";
import { createPatient, deletePatient, getPatientById, getPatients, loadPatients, updatePatient } from "../controllers/patientsController.js";
import { partialPatientValidation, patientValidation } from "../validators/patientsValidators.js";
import { authenticateToken, verifyAdmin } from "../middlewares/auth.js";

const patientsRouter = Router();

// api_url/patients
patientsRouter.get("", authenticateToken, getPatients);
patientsRouter.get("/:id", authenticateToken, getPatientById);
patientsRouter.post("", authenticateToken, patientValidation, createPatient);
patientsRouter.post("/load-data", loadPatients);
patientsRouter.put("/:id", authenticateToken, verifyAdmin, idValidator, partialPatientValidation, updatePatient);
patientsRouter.delete("/:id", authenticateToken, verifyAdmin, idValidator, deletePatient);

export default patientsRouter;
