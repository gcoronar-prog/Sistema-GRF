import { Router } from "express";
import {
  createUser,
  deleteuser,
  getUser,
  updateUser,
} from "../controllers/login.controller.js";

const router = Router();

router.get("/login/:id", getUser);
router.post("/login", createUser);
router.put("/login/:id", updateUser);
router.delete("/login/:id", deleteuser);

export default router;
