import { Router } from "express";
import {
  getEstadoExpe,
  getGlosasResumen,
  getInspectResumen,
  getLeyesInsp,
  getSectorInfra,
  getStatisticInspect,
  getTipoProce,
  getVehiculoResumen,
} from "../controllers/statisticsInspect.controller.js";

const router = Router();

router.get("/estadisticaInspeccion", getStatisticInspect);
router.put("/estadisticaInspeccion", getStatisticInspect);

router.get("/resumen_estado_inspe", getEstadoExpe);
router.get("/resumen_tipo_inspe", getTipoProce);
router.get("/resumen_ley_inspe", getLeyesInsp);
router.get("/resumen_inspector_inspe", getInspectResumen);
router.get("/resumen_vehi_inspe", getVehiculoResumen);
router.get("/resumen_sector_inspe", getSectorInfra);
router.get("/resumen_glosa_inspe", getGlosasResumen);

export default router;
