import { Router } from "express";
import { getEstadisticaCentral } from "../controllers/statisticsCentral.controller.js";
import { verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/estadisticaCentral", verifyToken, getEstadisticaCentral);
router.put("/estadisticaCentral", getEstadisticaCentral);

export default router;
