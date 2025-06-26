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
  getRecursos,
  getReport,
  getReports,
  getSectores,
  getTipoReporte,
  getTipoReportes,
  getTripulantes,
  getVehiculos,
  updateReport,
} from "../controllers/central.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

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
router.get("/tipoReporte", getTipoReporte);

router.get("/recursos", getRecursos);

router.get("/funcionarios", getFuncionarios);

router.get("/origenes", getOrigenes);

router.get("/tripulantes", getTripulantes);

router.get("/sectores", getSectores);
//ruta adjuntar archivos
router.get(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  getArchivos
);
router.get(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  findArchivos
);
router.post(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  createArchivo
);
router.delete(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  deleteArchivo
);

export default router;
