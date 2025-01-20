import { Router } from "express";
import {
  createArchivo,
  createReport,
  deleteArchivo,
  deleteReport,
  findArchivos,
  getArchivos,
  getChoferes,
  getFuncionarios,
  getInformantes,
  getLastReport,
  getOrigenes,
  getReport,
  getReports,
  getSectores,
  getTipoReportes,
  getTripulantes,
  getVehiculos,
  updateReport,
} from "../controllers/central.controller.js";

const router = Router();

router.get("/central", getReports);
router.get("/central/:id", getReport);
router.get("/central/last/report", getLastReport);
router.post("/central", createReport);
router.put("/central/:id", updateReport);
router.delete("/central/:id", deleteReport);

router.get("/driver", getChoferes);

router.get("/informantes", getInformantes);

router.get("/vehiculos", getVehiculos);

router.get("/tipoReportes", getTipoReportes);

router.get("/funcionarios", getFuncionarios);

router.get("/origenes", getOrigenes);

router.get("/tripulantes", getTripulantes);

router.get("/sectores", getSectores);

router.get("/fileAttach", getArchivos);
router.get("/fileAttach/:id", findArchivos);
router.post("/fileAttach", createArchivo);
router.delete("/fileAttach/:id", deleteArchivo);

export default router;
