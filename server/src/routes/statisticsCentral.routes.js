import { Router } from "express";
import {
  getEstadisticaCentral,
  getResumenClasi,
  getResumenEstado,
  getResumenOrigen,
  getResumenRango,
  getResumenRecursos,
} from "../controllers/statisticsCentral.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get(
  "/estadisticaCentral",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getEstadisticaCentral
);
router.put(
  "/estadisticaCentral",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getEstadisticaCentral
);

router.get(
  "/resumen_clasif_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getResumenClasi
);
router.get(
  "/resumen_origen_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getResumenOrigen
);
router.get(
  "/resumen_estado_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getResumenEstado
);
router.get(
  "/resumen_recursos_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getResumenRecursos
);
router.get(
  "/resumen_rango_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getResumenRango
);

export default router;
