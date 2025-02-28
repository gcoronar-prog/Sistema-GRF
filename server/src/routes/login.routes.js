import { Router } from "express";
import {
  createUser,
  deleteuser,
  getUser,
  login,
  profile,
  updateUser,
} from "../controllers/login.controller.js";
import {
  verifySuperAdmin,
  verifyToken,
} from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/login/:id", getUser);
router.post("/create/user", createUser);
router.put("/update/user/:id", updateUser);
router.delete("/delete/user/:id", deleteuser);

router.post("/login", login);
router.get("/profile", verifyToken, verifySuperAdmin, profile);

export default router;
