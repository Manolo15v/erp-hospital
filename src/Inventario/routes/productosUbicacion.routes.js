import { Router } from "express";
import { createProductoUbicacion, deleteProductoUbicacionById, getAllProductosUbicacion, getProductosUbicacionByUbicacionId, updateProductoUbicacionById } from "../controllers/productosUbicacion.controller.js";

const router = Router()

router.get("/", getAllProductosUbicacion);
router.get("/ubicacion/:id", getProductosUbicacionByUbicacionId);
router.post("/", createProductoUbicacion);
router.put("/:Id_Producto/:Id_Ubicacion", updateProductoUbicacionById);
router.delete("/:Id_Producto/:Id_Ubicacion", deleteProductoUbicacionById);

export default router;