import { Router } from "express";
import {
  getEstadisticaCentral,
  getResumenEstado,
} from "../controllers/statisticsCentral.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/estadisticaCentral", getEstadisticaCentral);
router.post("/estadisticaCentral", getEstadisticaCentral);

router.post("/resumen_estado_central", getResumenEstado);

export default router;
