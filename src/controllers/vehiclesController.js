import { Vehicle } from "../models/vehicleModel.js";
import { trError } from "../middlewares/error.js";

/**
 * GET /api/vehicles
 * Obtiene todos los vehículos con filtros opcionales
 */
export const getAllVehicles = async (req, res, next) => {
  try {
    const { state, type, project, page = 1, limit = 10 } = req.query;

    // Construir filtros
    const filter = {};
    if (state) filter.state = state;
    if (type) filter.type = { $regex: type, $options: "i" };
    if (project) filter.project = project;

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const vehicles = await Vehicle.find(filter)
      .populate("project", "name place client") // Populate información del proyecto
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Vehicle.countDocuments(filter);

    res.json({
      data: vehicles,
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
 * GET /api/vehicles/:id
 * Obtiene un vehículo por ID
 */
export const getVehicleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findById(id).populate(
      "project",
      "name place client status"
    );

    if (!vehicle) {
      trError(404, "Vehículo no encontrado");
    }

    res.json({ data: vehicle });
  } catch (error) {
    if (error.name === "CastError") {
      return next(trError(400, "ID de vehículo inválido"));
    }
    next(error);
  }
};

/**
 * POST /api/vehicles
 * Crea un nuevo vehículo
 */
export const createVehicle = async (req, res, next) => {
  try {
    const { plate, type, project, state } = req.body;

    // Validaciones básicas
    if (!plate || !type) {
      trError(400, "Placa y tipo son obligatorios");
    }

    // Verificar si la placa ya existe
    const existingVehicle = await Vehicle.findOne({ plate });
    if (existingVehicle) {
      trError(400, "Ya existe un vehículo con esa placa");
    }

    const vehicle = await Vehicle.create({
      plate,
      type,
      project: project || null,
      state: state || "active",
    });

    // Poblar el proyecto antes de enviar la respuesta
    await vehicle.populate("project", "name place client");

    res.status(201).json({
      message: "Vehículo creado exitosamente",
      data: vehicle,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(trError(400, "Error de validación", error.errors));
    }
    next(error);
  }
};

/**
 * PUT /api/vehicles/:id
 * Actualiza un vehículo existente
 */
export const updateVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { plate, type, project, state } = req.body;

    // Si se está actualizando la placa, verificar que no exista
    if (plate) {
      const existingVehicle = await Vehicle.findOne({
        plate,
        _id: { $ne: id },
      });
      if (existingVehicle) {
        trError(400, "Ya existe otro vehículo con esa placa");
      }
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      id,
      { plate, type, project, state },
      { new: true, runValidators: true }
    ).populate("project", "name place client");

    if (!vehicle) {
      trError(404, "Vehículo no encontrado");
    }

    res.json({
      message: "Vehículo actualizado exitosamente",
      data: vehicle,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(trError(400, "ID de vehículo inválido"));
    }
    if (error.name === "ValidationError") {
      return next(trError(400, "Error de validación", error.errors));
    }
    next(error);
  }
};

/**
 * DELETE /api/vehicles/:id
 * Elimina un vehículo
 */
export const deleteVehicle = async (req, res, next) => {
  try {
    const { id } = req.params;

    const vehicle = await Vehicle.findByIdAndDelete(id);

    if (!vehicle) {
      trError(404, "Vehículo no encontrado");
    }

    res.json({
      message: "Vehículo eliminado exitosamente",
      data: vehicle,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return next(trError(400, "ID de vehículo inválido"));
    }
    next(error);
  }
};