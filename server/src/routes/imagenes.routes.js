import { Router } from "express";
import {
  createSolicitud,
  deleteSolicitud,
  getFirstSolicitud,
  getLastSolicitud,
  getNextSolicitud,
  getPrevSolicitud,
  getSolicitud,
  getSolicitudes,
  updateSolicitud,
} from "../controllers/imagenes.controller.js";

const router = Router();

router.get("/imagenes/seg", getSolicitudes);
router.get("/imagenes/seg/:id/edit", getSolicitud);
router.post("/imagenes/seg/new", createSolicitud);
router.put("/imagenes/seg/:id/edit", updateSolicitud);
router.delete("/imagenes/seg/:id", deleteSolicitud);

router.get("/seg/imagenes/last", getLastSolicitud);
router.get("/seg/imagenes/first", getFirstSolicitud);
router.get("/seg/imagenes/prev/:id", getPrevSolicitud);
router.get("/seg/imagenes/next/:id", getNextSolicitud);

export default router;
