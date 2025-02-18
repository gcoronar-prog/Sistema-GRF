import { Router } from "express";
import { getEstadisticaCentral } from "../controllers/statisticsCentral.controller.js";

const router = Router();

//router.get("/estadisticaCentral", getEstadisticaCentral);
router.put("/estadisticaCentral", getEstadisticaCentral);

export default router;
