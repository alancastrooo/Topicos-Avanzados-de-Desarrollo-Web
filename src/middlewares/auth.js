import jwt from "jsonwebtoken";

/**
 * Auxiliar function to validate and decode a JWT.
 * @param {string} authHeader - Authorization Header.
 * @returns {object|null} Object with ser data or null in case there isn't a JWT.
 * @throws {Error} Throws an error if there's no valid token or if it's expired.
 */
const getUserFromToken = (authHeader) => {
  if (!authHeader) return null;

  const partes = authHeader.split(" ");
  if (partes.length !== 2 || partes[0] !== "Bearer") {
    throw new Error("Formato de token inválido");
  }

  const token = partes[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  return {
    id: decoded.id,
    role: decoded.role,
  };
};


/**
 * Middleware: Verifica token opcionalmente.
 * Si hay token, lo valida y añade datos en req.user.
 * Si no hay token, permite continuar y deja req.user = null.
 */
export const verifyToken = (req, res, next) => {
  try {
    const user = getUserFromToken(req.headers["authorization"]);
    req.user = user || null;
    
  } catch (error) {
    req.TError = error.message;
    req.user = null;
  }
  next();
};

/**
 * Middleware: Autenticación obligatoria.
 * Si no hay token válido, retorna error 401 o 403.
 */
export const authenticateToken = (req, res, next) => {
  try {
    const user = getUserFromToken(req.headers["authorization"]);
    if (!user) {
      return res
        .status(401)
        .json({ message: "Acceso denegado. Token no proporcionado." });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error verificando token obligatorio:", error.message);

    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expirado, inicie sesión nuevamente." });
    }

    return res
      .status(403)
      .json({ message: "Token inválido. Use 'Bearer <token>'." });
  }
};


/**
 * Middleware: Verifies the access level.
 * minimum auth level: 'analyst'.
 * !Note: authenticateToken is required prior to use this.
 */
export const verifyAnalyst = (req, res, next) => {
  if (req.user.role !== "analyst" && req.user.role !== "admin") {
    return res.status(403).json({ message: "Acceso solo para analistas o administradores" });
  }
  next();
};

/**
 * Middleware: Verifies the access level.
 * minimum auth level: 'admin'.
 * !Note: authenticateToken is required prior to use this.
 */
export const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin" ) {
    return res.status(403).json({ message: "Acceso solo para administradores" });
  }
  next();
};
