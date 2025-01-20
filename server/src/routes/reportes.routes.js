import { Router } from "express";
import {
  createReporte,
  deleteReporte,
  getFirstReporte,
  getLastReporte,
  getNextReporte,
  getPrevReporte,
  getReporte,
  getReportes,
  updateReporte,
} from "../controllers/reportes.controller.js";

const router = Router();

router.get("/reportes", getReportes);
router.get("/reportes/:id", getReporte);
router.post("/reportesService", createReporte);
router.put("/reportes/:id", updateReporte);
router.delete("/reportes/:id", deleteReporte);

router.get("/reportesService/first", getFirstReporte);
router.get("/reportesService/last", getLastReporte);
router.get("/reportesService/prev/:id", getPrevReporte);
router.get("/reportesService/next/:id", getNextReporte);

export default router;
