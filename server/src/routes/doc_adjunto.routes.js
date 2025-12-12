import { Router } from "express";
import {
  createArchivo,
  deleteArchivo,
  findArchivos,
  findArchivosById,
  getArchivos,
} from "../controllers/doc_adjunto.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";
const router = Router();
router.get(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  getArchivos
);
router.get(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  findArchivosById
);

router.post(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  createArchivo
);
router.delete(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "central", "inspeccion", "seguridad"),
  deleteArchivo
);

export default router;
