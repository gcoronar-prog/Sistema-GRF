import { Router } from "express";
import {
  createArchivoAten,
  createAtencion,
  deleteArchivoAten,
  deleteAtencion,
  findArchivosAten,
  getArchivosAten,
  getAtencion,
  getAtenciones,
  getFirstAtencion,
  getLastAtencion,
  getNextAtencion,
  getPoblaciones,
  getPrevAtencion,
  updateAtencion,
} from "../controllers/atencionSGC.controller.js";
import {
  createAccion,
  deleteAccion,
  getAcciones,
  getAccionesId,
  updateAccion,
} from "../controllers/acciones.controller.js";

const router = Router();

router.get("/atenciones/sgc", getAtenciones);
router.get("/atenciones/:id/sgc", getAtencion);
router.post("/atenciones/sgc", createAtencion);
router.put("/atenciones/:id/sgc", updateAtencion);
router.delete("/atenciones/:id/sgc", deleteAtencion);

router.get("/atenciones/sgc/last", getLastAtencion);
router.get("/atenciones/sgc/first", getFirstAtencion);
router.get("/atenciones/:id/sgc/prev", getPrevAtencion);
router.get("/atenciones/:id/sgc/next", getNextAtencion);

router.get("/fileAttach", getArchivosAten);
router.get("/fileAttach/:id", findArchivosAten);
router.post("/fileAttach", createArchivoAten);
router.delete("/fileAttach/:id", deleteArchivoAten);

router.get("/acciones/seguridad", getAcciones);
router.get("/acciones/seguridad/:id", getAccionesId);
router.post("/acciones/seguridad/:id", createAccion);
router.put("/acciones/seguridad/:id", updateAccion);
router.delete("/acciones/seguridad/:id", deleteAccion);

router.get("/poblaciones", getPoblaciones);

export default router;
