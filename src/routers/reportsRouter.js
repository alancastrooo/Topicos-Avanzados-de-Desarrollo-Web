import { Router } from "express";
import {
  getAccessReport,
  getCollectionReport,
} from "../controllers/reportsController.js";
import {
  authenticateToken,
  verifyAnalyst,
} from "../middlewares/auth.js";

const reportsRouter = Router();

// BASE: /api/reports

/**
 * GET /api/reports/access
 * Protegida - Rol mínimo: analyst
 * Obtiene reporte de accesos al sistema con filtros y estadísticas
 * 
 * Query params:
 * - desde: Fecha inicio en formato ISO (ej: 2024-01-01)
 * - hasta: Fecha fin en formato ISO (ej: 2024-12-31)
 * - recurso: Tipo de recurso (Cons-Project | Vehicle | User)
 * - action: Tipo de acción (create | retrieve | update | delete)
 * - userId: ID del usuario para filtrar sus accesos
 * - page: Número de página (default: 1)
 * - limit: Elementos por página (default: 50)
 */
reportsRouter.get(
  "/access",
  authenticateToken,
  verifyAnalyst,
  getAccessReport
);

/**
 * POST /api/reports/collection
 * Protegida - Rol mínimo: analyst (admins pueden ver reportes de usuarios)
 * Genera reporte específico sobre una colección con estadísticas personalizadas
 * 
 * Body:
 * {
 *   "collection": "Cons-Project" | "Vehicle" | "User",
 *   "filters": { ...filtros de MongoDB... },
 *   "reportType": "summary" | "detailed"
 * }
 */
reportsRouter.post(
  "/collection",
  authenticateToken,
  verifyAnalyst,
  getCollectionReport
);

export default reportsRouter;