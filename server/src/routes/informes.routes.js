import { Router } from "express";
import {
  createInformeCentral,
  deleteInformeCentral,
  getFirstInformeCentral,
  getInformeCentral,
  getInformes,
  getLastInformeCentral,
  getNextInformeCentral,
  getPrevInformeCentral,
  updateInformeCentral,
} from "../controllers/informes.controller.js";

const router = Router();

router.get("/informes_central", getInformes);
router.get("/informes_central/:id", getInformeCentral);
router.post("/informes_central", createInformeCentral);
router.put("/informes_central/:id", updateInformeCentral);
router.delete("/informes_central/:id", deleteInformeCentral);

router.get("/informe/central/last", getLastInformeCentral);
router.get("/informe/central/first", getFirstInformeCentral);
router.get("/informe/central/:id/prev", getPrevInformeCentral);
router.get("/informe/central/:id/next", getNextInformeCentral);

export default router;
