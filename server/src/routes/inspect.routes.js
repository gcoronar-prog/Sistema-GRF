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
  getDigitador,
  getExpedEstado,
  getExpediente,
  getExpediente2,
  getExpedientes,
  getExpedTipo,
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
import { verifyGroup, verifyToken } from "../middlewares/jwt.middleware.js";

const router = Router();

router.get(
  "/expedientes",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getExpedientes
);
router.get(
  "/expedientes/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getExpediente
);
router.post(
  "/expedientes",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  createEXfiles
);
router.put(
  "/expedientes/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  updateEXfiles
);
router.delete(
  "/expedientes/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  deleteExFile
);

router.get("/inspectores", getInspectores); //solo para devolver datos y rellenar campos

//router.get("/patrulleros", getPatrulleros); //solo para devolver datos y rellenar campos

router.get(
  "/leyes",

  getLeyes
); //solo para devolver datos y rellenar campos

router.get(
  "/vehi",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getVehInfrac
);
router.get(
  "/vehi/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getVehiculoContri
);
router.post(
  "/vehi",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  createVehiInfra
);
router.put(
  "/vehi/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  updateVehiInfra
);
router.delete(
  "/vehi/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  deleteVehiInfra
);

router.get(
  "/infraccion",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getInfracciones
);

router.post(
  "/infraccion",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  createInfraccion
);
router.put(
  "/infraccion/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  updateInfraccion
);
router.delete(
  "/infraccion/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  deleteInfraccion
);

router.post(
  "/exped",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  createExpediente
);
router.get(
  "/exped/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getAllExpedientes
);
router.put(
  "/exped/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  updateExpediente
);
router.delete(
  "/exped/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  deleteExpediente
);

router.get(
  "/last/exped",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getLastExpediente
);
router.get(
  "/first/exped",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getFirstExpediente
);
router.get(
  "/exp/prev/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getPrevExpediente
);
router.get(
  "/exp/next/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getNextExpediente
);

router.get("/datos_vehi", getDatosVehi); //solo para datos de vehiculos y rellenar campos de selección
router.get(
  "/glosas",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getGlosaLey
);

router.get(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  getArchivosExp
);
router.get(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  findArchivosExp
);
router.post(
  "/fileAttach",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  createArchivoExp
);
router.delete(
  "/fileAttach/:id",
  verifyToken,
  verifyGroup("superadmin", "inspeccion"),
  deleteArchivoExp
);

router.get(
  "/search_exped",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  searchInformeInspeccion
);
router.get(
  "/search_expediente",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  searchExpedientes
);

router.get(
  "/listaImagen",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getImgExpedientes
);

router.get(
  "/expedi/:id",
  //  verifyToken,
  // verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getExpediente2
);

router.get(
  "/exped_estado",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getExpedEstado
);
router.get(
  "/exped_tipo",
  verifyToken,
  verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getExpedTipo
);

router.get(
  "/digitador",
  //verifyToken,
  //verifyGroup("superadmin", "inspeccion", "noinspeccion"),
  getDigitador
);

export default router;
