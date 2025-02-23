import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  token = token.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { user_name } = decoded;
    req.user = user_name;
    console.log(user_name);
    next();
  } catch (error) {
    console.error(error);
    return res.status(400).json({ msg: "No autorizado" });
  }
};
