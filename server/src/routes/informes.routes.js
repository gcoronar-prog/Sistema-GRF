import { Router } from "express";
import {
  createInformeCentral,
  deleteInformeCentral,
  getAcciones,
  getEmergencias,
  getFirstInformeCentral,
  getInformeCentral,
  getInformes,
  getLastInformeCentral,
  getNextInformeCentral,
  getPendientes,
  getPrevInformeCentral,
  getProgreso,
  searchInformeCentral,
  updateInformeCentral,
} from "../controllers/informes.controller.js";
import {
  createAccionCentral,
  deleteAccion,
  getAccionesCentral,
  updateAccion,
} from "../controllers/acciones.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get(
  "/informes_central",
  verifyToken,
  verifyGroup("superadmin", "admin", "central"),
  getInformes,
);
router.get("/informes_central/:id", getInformeCentral);
router.get(
  "/informes/pendientes",
  verifyToken,
  verifyGroup("superadmin", "admin", "central"),
  getPendientes,
);
router.get("/informes/progreso", getProgreso);
router.get("/informes/emergencia", getEmergencias);
router.post(
  "/informes_central",
  verifyToken,
  verifyGroup("superadmin", "central"),
  createInformeCentral,
);
router.put(
  "/informes_central/:id",
  verifyToken,
  verifyGroup("superadmin", "central"),
  updateInformeCentral,
);
router.delete(
  "/informes_central/:id",
  verifyToken,
  verifyGroup("superadmin", "central"),
  deleteInformeCentral,
);

router.get(
  "/informe/central/last",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getLastInformeCentral,
);
router.get(
  "/informe/central/first",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getFirstInformeCentral,
);
router.get(
  "/informe/central/:id/prev",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getPrevInformeCentral,
);
router.get(
  "/informe/central/:id/next",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getNextInformeCentral,
);

router.get(
  "/acciones/central/:id",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getAccionesCentral,
);
router.post(
  "/acciones/central/:id",
  verifyToken,
  verifyGroup("superadmin", "central"),
  createAccionCentral,
);
router.put(
  "/acciones/central/:id",
  verifyToken,
  verifyGroup("superadmin", "central"),
  updateAccion,
);
router.delete(
  "/acciones/central/:id",
  verifyToken,
  verifyGroup("superadmin", "central"),
  deleteAccion,
);

router.get(
  "/search_inform",
  verifyToken,
  verifyGroup("superadmin", "central"),
  searchInformeCentral,
);

router.get(
  "/acciones_pdf/:id",
  verifyToken,
  verifyGroup("superadmin", "central"),
  getAcciones,
);

export default router;
