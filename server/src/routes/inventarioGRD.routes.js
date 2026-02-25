import { Router } from "express";
import {
  createEntrada,
  createPrestamo,
  createProducto,
  createSalida,
  deleteEntrada,
  deleteInventario,
  deletePrestamo,
  deleteSalida,
  getFirstElement,
  getEntrada,
  getInventarioGRD,
  getInventarios,
  getLastElement,
  getListaProductos,
  getListEntradas,
  getListPrestamos,
  getListSalidas,
  getPrestamo,
  getSalida,
  updateEntrada,
  updateInventario,
  updatePrestamo,
  updateSalida,
} from "../controllers/inventarioGRD.controller.js";

const router = Router();

router.get("/inventario/grd", getInventarios);
router.get("/inventario/grd/:id", getInventarioGRD);
router.get("/inventario/listado", getListaProductos);
router.post("/inventario/new", createProducto);
router.put("/inventario/grd/edit/:id", updateInventario);
router.delete("/inventario/grd/delete/:id", deleteInventario);

//entrada de productos
router.get("/inventario/entrada/:id", getEntrada);
router.get("/inventario/entrada/list", getListEntradas);
router.post("/inventario/entrada/new", createEntrada);
router.put("/inventario/entrada/edit/:id", updateEntrada);
router.delete("/inventario/entrada/delete/:id", deleteEntrada);

//prestamos de productos
router.get("/inventario/prestamo/list", getListPrestamos);
router.get("/inventario/prestamo/:id", getPrestamo);
router.post("/inventario/prestamo/new", createPrestamo);
router.put("/inventario/prestamo/edit/:id", updatePrestamo);
router.delete("/inventario/prestamo/delete/:id", deletePrestamo);

//salidas de productos
router.get("/inventario/salida/list", getListSalidas);
router.get("/inventario/salida/:id", getSalida);
router.post("/inventario/salida/new", createSalida);
router.put("/inventario/salida/edit/:id", updateSalida);
router.delete("/inventario/salida/delete/:id", deleteSalida);

router.get("/inventario/last", getLastElement);
router.get("/inventario/first", getFirstElement);

/*router.get("/inventario/last/grd", getLastInventario);
router.get("/inventario/first/grd", getFirstInventario);
router.get("/inventario/prev/grd/:id", getPrevInventario);
router.get("/inventario/next/grd/:id", getNextInventario);*/

export default router;
