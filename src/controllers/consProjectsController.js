import { ConsProject } from "../models/consProjectModel.js"; 
import { trError } from "../middlewares/error.js";

/**
 * GET /api/cons-projects
 * Obtiene todos los proyectos con filtros opcionales
 */
export const getAllProjects = async (req, res, next) => {
  try {
    const { status, client, place, page = 1, limit = 10 } = req.query;

    // Construir filtros
    const filter = {};
    if (status) filter.status = status;
    if (client) filter.client = { $regex: client, $options: "i" }; // Búsqueda case-insensitive
    if (place) filter.place = { $regex: place, $options: "i" };

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const projects = await ConsProject.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ConsProject.countDocuments(filter);

    res.json({
      data: projects,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/cons-projects/:id
 * Obtiene un proyecto por ID
 */
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await ConsProject.findById(id);

    if (!project) {
      trError(404, "Proyecto no encontrado");
    }

    res.json({ data: project });
  } catch (error) {
    if (error.name === "CastError") {
      return next(trError(400, "ID de proyecto inválido"));
    }
    next(error);
  }
};

/**
 * POST /api/cons-projects
 * Crea un nuevo proyecto
 */
export const createProject = async (req, res, next) => {
  try {
    const { name, place, status, startDate, client } = req.body;

    // Validaciones básicas
    if (!name || !place || !client) {
      trError(400, "Nombre, lugar y cliente son obligatorios");
    }

    const project = await ConsProject.create({
      name,
      place,
      status: status || "Pending",
      startDate: startDate || new Date(),
      client,
    });

    res.status(201).json({
      message: "Proyecto creado exitosamente",
      data: project,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(trError(400, "Error de validación", error.errors));
    }
    next(error);
  }
};

/**
 * PUT /api/cons-projects/:id
 * Actualiza un proyecto existente
 */
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, place, status, startDate, client } = req.body;

    const project = await ConsProject.findByIdAndUpdate(
      id,
      { name, place, status, startDate, client },
      { new: true, runValidators: true }
    );

    if (!project) {
      trError(404, "Proyecto no encontrado");
    }

    res.json({
      message: "Proyecto actualizado exitosamente",
      data: project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(trError(400, "ID de proyecto inválido"));
    }
    if (error.name === "ValidationError") {
      return next(trError(400, "Error de validación", error.errors));
    }
    next(error);
  }
};

/**
 * DELETE /api/cons-projects/:id
 * Elimina un proyecto
 */
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;

    const project = await ConsProject.findByIdAndDelete(id);

    if (!project) {
      trError(404, "Proyecto no encontrado");
    }

    res.json({
      message: "Proyecto eliminado exitosamente",
      data: project,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(trError(400, "ID de proyecto inválido"));
    }
    next(error);
  }
};