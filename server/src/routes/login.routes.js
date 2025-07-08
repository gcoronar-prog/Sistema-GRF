import { Router } from "express";
import {
  createUser,
  deleteuser,
  getUser,
  getUsers,
  login,
  profile,
  realResetPassword,
  resetPassword,
  updateUser,
} from "../controllers/login.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/login/:id", getUser);
router.post("/create/user", createUser);
router.post("/reset/pass/:id", resetPassword);
router.post("/reset/pass", realResetPassword);
router.put("/update/user/:id", updateUser);
router.delete("/delete/user/:id", deleteuser);
router.get("/get/users", getUsers);

router.post("/login", login);
router.get(
  "/profile",
  verifyToken,
  verifyGroup(
    "superadmin",
    "central",
    "seguridad",
    "inspeccion",
    "noinspeccion",
    "grd"
  ),
  profile,
  (req, res) => {
    res.status(200).json({ msg: "Acceso a superadmin" });
  }
);

export default router;
