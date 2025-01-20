import { Router } from "express";
import {
  createInformeCentral,
  getInformeCentral,
  getInformes,
  updateInformeCentral,
} from "../controllers/informes.controller.js";

const router = Router();

router.get("/informes_central", getInformes);
router.get("/informes_central/:id", getInformeCentral);
router.post("/informes_central", createInformeCentral);
router.put("/informes_central/:id", updateInformeCentral);

export default router;
