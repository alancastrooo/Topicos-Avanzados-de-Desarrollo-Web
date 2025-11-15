import { Access } from "../models/accessModel.js";

export const ServerLog = async (req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
};

/**
 * Middleware para registrar accesos a recursos
 * Debe usarse DESPUÉS de authenticateToken
 *
 * @param {string} resourceType - Tipo de recurso: 'ConsProject', 'Vehicle', 'User'
 * @param {string} actionType - Acción: 'create', 'retrieve', 'update', 'delete'
 * @returns {Function} Middleware function
 */
export const logAccess = (resourceType, actionType) => {
  return async (req, res, next) => {
    // Guardar la función original res.json
    const originalJson = res.json.bind(res);

    // Sobrescribir res.json para capturar la respuesta exitosa
    res.json = function (data) {
      // Solo registrar si hay usuario autenticado y la respuesta es exitosa (200-299)
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        // Determinar el resourceId según el contexto
        let resourceId = null;

        // Para operaciones sobre un recurso específico (GET /resource/:id, PUT, DELETE)
        if (req.params.id) {
          resourceId = req.params.id;
        }
        // Para operaciones CREATE, el ID viene en la respuesta
        else if (actionType === "create" && data && data._id) {
          resourceId = data._id;
        }
        // Para operaciones CREATE que devuelven un objeto anidado
        else if (
          actionType === "create" &&
          data &&
          data.data &&
          data.data._id
        ) {
          resourceId = data.data._id;
        }

        // Registrar el acceso de forma asíncrona (no bloquea la respuesta)
        if (resourceId) {
          Access.create({
            user: req.user.id,
            resource: resourceType,
            resourceId: resourceId,
            action: actionType,
          }).catch((error) => {
            console.error("Error al registrar acceso:", error.message);
          });
        }
      }

      // Llamar a la función original
      return originalJson(data);
    };

    next();
  };
};

/**
 * Registra acceso para operaciones de listado (retrieve múltiple)
 * Registra un acceso genérico sin resourceId específico
 */
export const logListAccess = (resourceType) => {
  return async (req, res, next) => {
    const originalJson = res.json.bind(res);
    
    res.json = function (data) {
      if (req.user && res.statusCode >= 200 && res.statusCode < 300) {
        Access.create({
          user: req.user.id,
          resource: resourceType,
          resourceId: "000000000000000000000000", // ID placeholder para operaciones de listado
          action: "retrieve",
        });
      }
      return originalJson(data);
    };
    
    next();
  };
};