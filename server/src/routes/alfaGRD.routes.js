import { Router } from "express";
import {
  createAlfa,
  deleteAlfa,
  getAllInformesALFA,
  getFirstAlfa,
  getFuncionarioGRD,
  getInformesALFA,
  getLastAlfa,
  getNextAlfa,
  getPrevAlfa,
  updateALFA,
} from "../controllers/alfaGRD.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";
const router = Router();

router.get("/informe_alfa", getAllInformesALFA);
router.get(
  "/alfa/:id",
  //verifyToken,
  //verifyGroup("superadmin", "grd"),
  getInformesALFA
);
router.post("/alfa", createAlfa);
router.put("/alfa/:id", updateALFA);
router.delete("/alfa/:id", deleteAlfa);
router.get("/lastalfa", getLastAlfa);
router.get("/firstalfa", getFirstAlfa);
router.get("/alfa/prev/:id", getPrevAlfa);
router.get("/alfa/next/:id", getNextAlfa);

router.get("/funciongrd", getFuncionarioGRD);

export default router;
