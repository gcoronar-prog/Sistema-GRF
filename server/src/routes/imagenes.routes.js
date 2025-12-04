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
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get(
  "/imagenes/seg",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  getSolicitudes
);
router.get(
  "/imagenes/seg/:id/edit",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  getSolicitud
);
router.post(
  "/imagenes/seg/new",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  createSolicitud
);
router.put(
  "/imagenes/seg/:id/edit",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  updateSolicitud
);
router.delete(
  "/imagenes/seg/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  deleteSolicitud
);

router.get("/seg/imagenes/last", getLastSolicitud);
router.get("/seg/imagenes/first", getFirstSolicitud);
router.get("/seg/imagenes/prev/:id", getPrevSolicitud);
router.get("/seg/imagenes/next/:id", getNextSolicitud);

export default router;
