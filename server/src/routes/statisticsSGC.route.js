import { Router } from "express";
import {
  getStatisticSGC,
  resumenEstado,
} from "../controllers/statisticsSGC.controller.js";

const router = Router();

router.get("/estadisticaSGC", getStatisticSGC);

router.get("/resumen_estado_sgc", resumenEstado);

export default router;
