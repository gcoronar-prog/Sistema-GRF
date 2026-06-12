import { Router } from "express";
import { getStatisticsAlfa } from "../controllers/statistics.alfa.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get("/estadisticaAlfa", getStatisticsAlfa);

export default router;

//verifyToken, verifyGroup(["admin", "user"])
