import { Router } from "express";
import {
  createProducto,
  deleteInventario,
  getFirstInventario,
  getInventarioGRD,
  getInventarios,
  getLastInventario,
  getListaProductos,
  getNextInventario,
  getPrevInventario,
  updateInventario,
} from "../controllers/inventarioGRD.controller.js";

const router = Router();

router.get("/inventario/grd", getInventarios);
router.get("/inventario/grd/:id", getInventarioGRD);
router.get("/inventario/listado", getListaProductos);
router.post("/inventario/new", createProducto);
router.put("/inventario/grd/:id/edit", updateInventario);
router.delete("/inventario/grd/:id/delete", deleteInventario);

router.get("/inventario/last/grd", getLastInventario);
router.get("/inventario/first/grd", getFirstInventario);
router.get("/inventario/prev/grd/:id", getPrevInventario);
router.get("/inventario/next/grd/:id", getNextInventario);

export default router;
