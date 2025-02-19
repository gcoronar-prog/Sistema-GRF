import { Router } from "express";
import {
  createUser,
  deleteuser,
  getUser,
  login,
  updateUser,
} from "../controllers/login.controller.js";

const router = Router();

router.get("/login/:id", getUser);
router.post("/create/user", createUser);
router.put("/update/user/:id", updateUser);
router.delete("/delete/user/:id", deleteuser);

router.post("/login", login);

export default router;
