import { Router } from "express";
import {
  getEstadisticaCentral,
  getResumenClasi,
  getResumenEstado,
  getResumenOrigen,
  getResumenRango,
  getResumenRecursos,
} from "../controllers/statisticsCentral.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/estadisticaCentral", getEstadisticaCentral);
router.put("/estadisticaCentral", getEstadisticaCentral);

router.get("/resumen_clasif_central", getResumenClasi);
router.get("/resumen_origen_central", getResumenOrigen);
router.get("/resumen_estado_central", getResumenEstado);
router.get("/resumen_recursos_central", getResumenRecursos);
router.get("/resumen_rango_central", getResumenRango);

export default router;
