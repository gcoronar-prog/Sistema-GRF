import { Router } from "express";
import {
  getEstadisticaCentral,
  getResumenClasi,
  getResumenEstado,
  getResumenOrigen,
  getResumenRango,
  getResumenRecursos,
  getResumenUser,
  getResumenVehi,
} from "../controllers/statisticsCentral.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";
import { getUsersCentral } from "../controllers/users.controller.js";

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

router.get(
  "/resumen_user_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getResumenUser
);

router.get(
  "/resumen_vehi_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getResumenVehi
);

router.get("/users_gie", getUsersCentral);
export default router;
