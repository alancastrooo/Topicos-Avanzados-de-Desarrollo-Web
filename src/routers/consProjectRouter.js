import express from "express";
import {
  authenticateToken,
  verifyAnalyst,
  verifyAdmin,
} from "../middlewares/auth.js";
import { logAccess, logListAccess } from "../middlewares/log.js";
import { getAllProjects, getProjectById, createProject, deleteProject, updateProject } from "../controllers/consProjectsController.js";

const conProjectRouter = express.Router();

/**
 * GET /api/cons-projects
 * Protegida - Rol mínimo: analyst
 * Obtiene todos los proyectos
 */
conProjectRouter.get(
  "/",
  authenticateToken,
  verifyAnalyst,
  logListAccess("ConsProject"),
  getAllProjects
);

/**
 * GET /api/cons-projects/:id
 * Protegida - Rol mínimo: analyst
 * Obtiene un proyecto por ID y registra el acceso
 */
conProjectRouter.get(
  "/:id",
  authenticateToken,
  verifyAnalyst,
  logAccess("ConsProject", "retrieve"),
  getProjectById
);

/**
 * POST /api/cons-projects
 * Protegida - Rol mínimo: admin
 * Crea un nuevo proyecto y registra el acceso
 */
conProjectRouter.post(
  "/",
  authenticateToken,
  verifyAdmin,
  logAccess("ConsProject", "create"),
  createProject
);

/**
 * PUT /api/cons-projects/:id
 * Protegida - Rol mínimo: admin
 * Actualiza un proyecto y registra el acceso
 */
conProjectRouter.put(
  "/:id",
  authenticateToken,
  verifyAdmin,
  logAccess("ConsProject", "update"),
  updateProject
);

/**
 * DELETE /api/cons-projects/:id
 * Protegida - Rol mínimo: admin
 * Elimina un proyecto y registra el acceso
 */
conProjectRouter.delete(
  "/:id",
  authenticateToken,
  verifyAdmin,
  logAccess("ConsProject", "delete"),
  deleteProject
);

export default conProjectRouter;
