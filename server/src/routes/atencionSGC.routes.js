import { Router } from "express";
import {
  getAtencion,
  getAtencion2,
  getAtenciones,
  getFirstAtencion,
  getJuntaVecinos,
  getLastAtencion,
  getNextAtencion,
  getPoblaciones,
  getPrevAtencion,
  updateAtencion,
  createAtencion,
  deleteAtencion,
} from "../controllers/atencionSGC.controller.js";
import {
  createAccion,
  deleteAccion,
  getAcciones,
  getAccionesId,
  updateAccion,
} from "../controllers/acciones.controller.js";
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get(
  "/aten/sgc/:id",
  //verifyToken,
  //verifyGroup("superadmin", "seguridad"),
  getAtencion2
);

router.get(
  "/atenciones/sgc",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  getAtenciones
);
router.get(
  "/atenciones/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  getAtencion
);
router.post(
  "/atenciones/sgc",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  createAtencion
);
router.put(
  "/atenciones/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  updateAtencion
);
router.delete(
  "/atenciones/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  deleteAtencion
);

router.get("/atenciones/sgc/last", getLastAtencion);
router.get("/atenciones/sgc/first", getFirstAtencion);
router.get("/atenciones/:id/sgc/prev", getPrevAtencion);
router.get("/atenciones/:id/sgc/next", getNextAtencion);

/*router.get(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  getArchivosAten
);
router.get(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  findArchivosAten
);
router.post(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  createArchivoAten
);
router.delete(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  deleteArchivoAten
);*/

router.get(
  "/acciones/seguridad",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  getAcciones
);
router.get(
  "/acciones/seguridad/:id",
  //verifyToken,
  //verifyGroup("superadmin", "seguridad"),
  getAccionesId
);
router.post(
  "/acciones/seguridad/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  createAccion
);
router.put(
  "/acciones/seguridad/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  updateAccion
);
router.delete(
  "/acciones/seguridad/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  deleteAccion
);

router.get("/poblaciones", getPoblaciones);
router.get("/jjvv", getJuntaVecinos);

/*router.get(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  getArchivosAten
);
router.get(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  findArchivosAten
);
router.post(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  createArchivoAten
);
router.delete(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "seguridad"),
  deleteArchivoAten
);*/

export default router;
