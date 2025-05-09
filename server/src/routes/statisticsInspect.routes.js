import { Router } from "express";
import {
  getEstadoExpe,
  getStatisticInspect,
  getTipoProce,
} from "../controllers/statisticsInspect.controller.js";

const router = Router();

router.get("/estadisticaInspeccion", getStatisticInspect);
router.put("/estadisticaInspeccion", getStatisticInspect);

router.get("/resumen_estado_inspe", getEstadoExpe);
router.get("/resumen_tipo_inspe", getTipoProce);

export default router;
