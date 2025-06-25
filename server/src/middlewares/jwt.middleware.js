// auth.js
import jwt from "jsonwebtoken";
import { rolesGrupo } from "./groupRole.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { user_name, user_rol } = decoded;
    req.user = user_name;
    req.rol = user_rol;

    next();
  } catch (error) {
    console.error(error);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Tiempo de token terminado" });
    }
    return res.status(401).json({ msg: "No autorizado" });
  }
};

export const verifyGroup = (...groups) => {
  return (req, res, next) => {
    const allowedRoles = groups
      .map((group) => rolesGrupo[group])
      .filter(Boolean)
      .flat();

    if (!allowedRoles.includes(req.rol)) {
      return res.status(403).json({ msg: "Usuario no autorizado" });
    }

    next();
  };
};
