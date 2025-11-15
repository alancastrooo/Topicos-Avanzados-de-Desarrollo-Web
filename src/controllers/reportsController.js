import { Access } from "../models/accessModel.js"; 
import { ConsProject } from "../models/consProjectModel.js";
import { User } from "../models/userModel.js";
import { Vehicle } from "../models/vehicleModel.js";
import { trError } from "../middlewares/error.js";

/**
 * GET /api/reports/access
 * Reporte de accesos con filtros
 * Query params: from, to, resource, page, limit
 */
export const getAccessReport = async (req, res, next) => {
  try {
    const {
      from,
      to,
      resource,
      page = 1,
      limit = 50,
    } = req.query;

    // Construir filtros
    const filter = {};

    // Filtro por fechas
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) filter.createdAt.$lte = new Date(to);
    }

    // Filtro por resource
    if (resource) {
      filter.resource = resource;
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const accesses = await Access.find(filter)
      .populate("user", "name email role")
      .populate("resourceId") // Populate dinámicamente según refPath
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Access.countDocuments(filter);

    // Estadísticas adicionales
    const stats = await Access.aggregate([
      { $match: filter },
      {
        $group: {
          _id: {
            resource: "$resource",
            action: "$action",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.resource",
          actions: {
            $push: {
              action: "$_id.action",
              count: "$count",
            },
          },
          total: { $sum: "$count" },
        },
      },
    ]);

    res.json({
      data: accesses,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
      stats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/reports/collection
 * Genera reporte específico sobre una colección
 * Body: { collection: "Cons-Project" | "Vehicle" | "User", filters: {...}, reportType: "summary" | "detailed" }
 */
export const getCollectionReport = async (req, res, next) => {
  try {
    const { collection, filters = {}, reportType = "summary" } = req.body;

    // Validar colección
    const allowedCollections = ["Cons-Project", "Vehicle", "User"];
    if (!allowedCollections.includes(collection)) {
      trError(400, "Colección no válida. Use: Cons-Project, Vehicle, o User");
    }

    // Verificar permisos según el rol
    // Los analistas pueden ver todo excepto reportes detallados de usuarios
    if (req.user.role === "analyst" && collection === "User") {
      trError(
        403,
        "Los analistas no tienen permiso para generar reportes de usuarios"
      );
    }

    let report = {};

    switch (collection) {
      case "Cons-Project":
        report = await generateProjectReport(filters, reportType);
        break;

      case "Vehicle":
        report = await generateVehicleReport(filters, reportType);
        break;

      case "User":
        report = await generateUserReport(filters, reportType);
        break;
    }

    res.json({
      collection,
      reportType,
      generatedAt: new Date(),
      data: report,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Genera reporte de proyectos
 */
async function generateProjectReport(filters = {}, reportType) {
  const projects = await ConsProject.find(filters);

  const summary = {
    total: projects.length,
    byStatus: {
      Pending: projects.filter((p) => p.status === "Pending").length,
      "In Progress": projects.filter((p) => p.status === "In Progress").length,
      Completed: projects.filter((p) => p.status === "Completed").length,
    },
    byClient: {},
  };

  // Agrupar por cliente
  projects.forEach((project) => {
    if (!summary.byClient[project.client]) {
      summary.byClient[project.client] = 0;
    }
    summary.byClient[project.client]++;
  });

  if (reportType === "detailed") {
    return {
      summary,
      projects: projects.map((p) => ({
        _id: p._id,
        name: p.name,
        place: p.place,
        status: p.status,
        client: p.client,
        startDate: p.startDate,
        createdAt: p.createdAt,
      })),
    };
  }

  return summary;
}

/**
 * Genera reporte de vehículos
 */
async function generateVehicleReport(filters = {}, reportType) {
  const vehicles = await Vehicle.find(filters).populate(
    "project",
    "name client"
  );

  const summary = {
    total: vehicles.length,
    byState: {
      active: vehicles.filter((v) => v.state === "active").length,
      inactive: vehicles.filter((v) => v.state === "inactive").length,
      "in maintenance": vehicles.filter((v) => v.state === "in maintenance")
        .length,
    },
    byType: {},
    withProject: vehicles.filter((v) => v.project).length,
    withoutProject: vehicles.filter((v) => !v.project).length,
  };

  // Agrupar por tipo
  vehicles.forEach((vehicle) => {
    if (!summary.byType[vehicle.type]) {
      summary.byType[vehicle.type] = 0;
    }
    summary.byType[vehicle.type]++;
  });

  if (reportType === "detailed") {
    return {
      summary,
      vehicles: vehicles.map((v) => ({
        _id: v._id,
        plate: v.plate,
        type: v.type,
        state: v.state,
        project: v.project
          ? {
              _id: v.project._id,
              name: v.project.name,
              client: v.project.client,
            }
          : null,
        createdAt: v.createdAt,
      })),
    };
  }

  return summary;
}

/**
 * Genera reporte de usuarios (solo para admins)
 */
async function generateUserReport(filters = {}, reportType) {
  const users = await User.find(filters);

  const summary = {
    total: users.length,
    byRole: {
      admin: users.filter((u) => u.role === "admin").length,
      analyst: users.filter((u) => u.role === "analyst").length,
      visitor: users.filter((u) => u.role === "visitor").length,
    },
    active: users.filter((u) => u.isActive).length,
    inactive: users.filter((u) => !u.isActive).length,
  };

  if (reportType === "detailed") {
    return {
      summary,
      users: users.map((u) => ({
        _id: u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        createdAt: u.createdAt,
      })),
    };
  }

  return summary;
}