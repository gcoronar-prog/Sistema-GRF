import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_name, user_rol } = decoded;
    req.user = user_name;
    req.rol = user_rol;

    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "No autorizado" });
  }
};

export const verifySuperAdmin = (req, res, next) => {
  if (req.rol === "superadmin") {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyAdmin = (req, res, next) => {
  if (req.rol === "admin" || req.rol === "superadmin") {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyAdminCentral = (req, res, next) => {
  if (req.rol === "admincentral" || req.rol === "superadmin") {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyAdminInspeccion = (req, res, next) => {
  if (req.rol === "admininspeccion" || req.rol === "superadmin") {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyAdminSeguridad = (req, res, next) => {
  if (req.rol === "adminseguridad" || req.rol === "superadmin") {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyAdminGRD = (req, res, next) => {
  if (req.rol === "admingrd" || req.rol === "superadmin") {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyUserCentral = (req, res, next) => {
  if (
    req.rol === "usercentral" ||
    req.rol === "superadmin" ||
    req.rol === "admincentral"
  ) {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyUserInspeccion = (req, res, next) => {
  if (
    req.rol === "userinspeccion" ||
    req.rol === "superadmin" ||
    req.rol === "admininspeccion"
  ) {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyUserSeguridad = (req, res, next) => {
  if (
    req.rol === "userseguridad" ||
    req.rol === "superadmin" ||
    req.rol === "adminseguridad"
  ) {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};

export const verifyUserGRD = (req, res, next) => {
  if (
    req.rol === "usergrd" ||
    req.rol === "superadmin" ||
    req.rol === "admingrd"
  ) {
    return next();
  }
  return res.status(403).json({ msg: "Usuario no autorizado" });
};
