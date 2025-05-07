import { Router } from "express";
import { getStatisticInspect } from "../controllers/statisticsInspect.controller.js";

const router = Router();

router.get("/estadisticaInspeccion", getStatisticInspect);
router.put("/estadisticaInspeccion", getStatisticInspect);

export default router;
