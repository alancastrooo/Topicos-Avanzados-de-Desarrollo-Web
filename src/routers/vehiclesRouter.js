import { Router } from "express";
import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehiclesController.js";
import {
  authenticateToken,
  verifyAnalyst,
  verifyAdmin,
} from "../middlewares/auth.js";
import { logAccess, logListAccess } from "../middlewares/log.js";

const vehiclesRouter = Router();

// api_url/api/vehicles

/**
 * GET /api/vehicles
 * Protegida - Cualquier usuario autenticado
 * Obtiene todos los vehículos con filtros opcionales:
 * - state: active | inactive | in maintenance
 * - type: tipo de vehículo (búsqueda parcial)
 * - project: ID del proyecto
 * - page: número de página (default: 1)
 * - limit: elementos por página (default: 10)
 */
vehiclesRouter.get(
  "/",
  authenticateToken,
  logListAccess("Vehicle"),
  getAllVehicles
);

/**
 * GET /api/vehicles/:id
 * Protegida - Cualquier usuario autenticado
 * Obtiene un vehículo específico por ID
 * Incluye información del proyecto relacionado (populate)
 */
vehiclesRouter.get(
  "/:id",
  authenticateToken,
  logAccess("Vehicle", "retrieve"),
  getVehicleById
);

/**
 * POST /api/vehicles
 * Protegida - Rol mínimo: analyst
 * Crea un nuevo vehículo
 * Body requerido:
 * - plate: string (único)
 * - type: string
 * - project: ObjectId (opcional)
 * - state: "active" | "inactive" | "in maintenance" (default: "active")
 */
vehiclesRouter.post(
  "/",
  authenticateToken,
  verifyAnalyst,
  logAccess("Vehicle", "create"),
  createVehicle
);

/**
 * PUT /api/vehicles/:id
 * Protegida - Rol mínimo: analyst
 * Actualiza un vehículo existente
 * Body: cualquiera de los campos del vehículo
 */
vehiclesRouter.put(
  "/:id",
  authenticateToken,
  verifyAnalyst,
  logAccess("Vehicle", "update"),
  updateVehicle
);

/**
 * DELETE /api/vehicles/:id
 * Protegida - Rol mínimo: admin
 * Elimina un vehículo
 */
vehiclesRouter.delete(
  "/:id",
  authenticateToken,
  verifyAdmin,
  logAccess("Vehicle", "delete"),
  deleteVehicle
);

export default vehiclesRouter;