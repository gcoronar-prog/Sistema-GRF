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
    console.log(user_name);
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
