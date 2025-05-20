import { Router } from "express";
import {
  createArchivoExp,
  createEXfiles,
  createExpediente,
  createInfraccion,
  createVehiInfra,
  deleteArchivoExp,
  deleteExFile,
  deleteExpediente,
  deleteInfraccion,
  deleteVehiInfra,
  findArchivosExp,
  getAllExpedientes,
  getArchivosExp,
  getDatosVehi,
  getExpediente,
  getExpediente2,
  getExpedientes,
  getFirstExpediente,
  getGlosaLey,
  getImgExpedientes,
  getInfracciones,
  getInspectores,
  getLastExpediente,
  getLeyes,
  getNextExpediente,
  getPrevExpediente,
  getVehiculoContri,
  getVehInfrac,
  searchExpedientes,
  searchInformeInspeccion,
  updateEXfiles,
  updateExpediente,
  updateInfraccion,
  updateVehiInfra,
} from "../controllers/inspect.controller.js";

const router = Router();

router.get("/expedientes", getExpedientes);
router.get("/expedientes/:id", getExpediente);
router.post("/expedientes", createEXfiles);
router.put("/expedientes/:id", updateEXfiles);
router.delete("/expedientes/:id", deleteExFile);

router.get("/inspectores", getInspectores); //solo para devolver datos y rellenar campos

//router.get("/patrulleros", getPatrulleros); //solo para devolver datos y rellenar campos

router.get("/leyes", getLeyes); //solo para devolver datos y rellenar campos

router.get("/vehi", getVehInfrac);
router.get("/vehi/:id", getVehiculoContri);
router.post("/vehi", createVehiInfra);
router.put("/vehi/:id", updateVehiInfra);
router.delete("/vehi/:id", deleteVehiInfra);

router.get("/infraccion", getInfracciones);

router.post("/infraccion", createInfraccion);
router.put("/infraccion/:id", updateInfraccion);
router.delete("/infraccion/:id", deleteInfraccion);

router.post("/exped", createExpediente);
router.get("/exped/:id", getAllExpedientes);
router.put("/exped/:id", updateExpediente);
router.delete("/exped/:id", deleteExpediente);

router.get("/last/exped", getLastExpediente);
router.get("/first/exped", getFirstExpediente);
router.get("/exp/prev/:id", getPrevExpediente);
router.get("/exp/next/:id", getNextExpediente);

router.get("/datos_vehi", getDatosVehi); //solo para datos de vehiculos y rellenar campos de selección
router.get("/glosas", getGlosaLey);

router.get("/fileAttach", getArchivosExp);
router.get("/fileAttach/:id", findArchivosExp);
router.post("/fileAttach", createArchivoExp);
router.delete("/fileAttach/:id", deleteArchivoExp);

router.get("/search_exped", searchInformeInspeccion);
router.get("/search_expediente", searchExpedientes);

router.get("/listaImagen", getImgExpedientes);

router.get("/expedi/:id", getExpediente2);

export default router;
