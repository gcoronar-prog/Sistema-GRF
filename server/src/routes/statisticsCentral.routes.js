import { Router } from "express";
import {
  getEstadisticaCentral,
  getResumenClasi,
  getResumenEstado,
  getResumenOrigen,
  getResumenRecursos,
} from "../controllers/statisticsCentral.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/estadisticaCentral", getEstadisticaCentral);
router.post("/estadisticaCentral", getEstadisticaCentral);

router.post("/resumen_clasif_central", getResumenClasi);
router.post("/resumen_origen_central", getResumenOrigen);
router.post("/resumen_estado_central", getResumenEstado);
router.post("/resumen_recursos_central", getResumenRecursos);

export default router;
