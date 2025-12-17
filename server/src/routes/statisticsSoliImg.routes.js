import { Router } from "express";
import { getStatisticsSoliImg } from "../controllers/statisticsSoliImg.js";

const router = Router();

router.get("/estadisticaIMG", getStatisticsSoliImg);

export default router;
