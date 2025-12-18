import { Router } from "express";
import { getStatisticsSoliImg } from "../controllers/statisticsSoliImg.controller.js";

const router = Router();

router.get("/estadisticaIMG", getStatisticsSoliImg);

export default router;
