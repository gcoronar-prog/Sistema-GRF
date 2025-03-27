import { Router } from "express";
import {
  createInformeCentral,
  deleteInformeCentral,
  getFirstInformeCentral,
  getInformeCentral,
  getInformes,
  getLastInformeCentral,
  getNextInformeCentral,
  getPendientes,
  getPrevInformeCentral,
  getProgreso,
  updateInformeCentral,
} from "../controllers/informes.controller.js";
import {
  createAccionCentral,
  deleteAccion,
  getAccionesCentral,
  updateAccion,
} from "../controllers/acciones.controller.js";

const router = Router();

router.get("/informes_central", getInformes);
router.get("/informes_central/:id", getInformeCentral);
router.get("/informes/pendientes", getPendientes);
router.get("/informes/progreso", getProgreso);
router.post("/informes_central", createInformeCentral);
router.put("/informes_central/:id", updateInformeCentral);
router.delete("/informes_central/:id", deleteInformeCentral);

router.get("/informe/central/last", getLastInformeCentral);
router.get("/informe/central/first", getFirstInformeCentral);
router.get("/informe/central/:id/prev", getPrevInformeCentral);
router.get("/informe/central/:id/next", getNextInformeCentral);

router.get("/acciones/central/:id", getAccionesCentral);
router.post("/acciones/central/:id", createAccionCentral);
router.put("/acciones/central/:id", updateAccion);
router.delete("/acciones/central/:id", deleteAccion);

export default router;
