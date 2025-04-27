import { Router } from "express";
import { createProducto, deleteProductoById, getAllProductos, getProductoById, getProductosByModeloId, updateProductoById } from "../controllers/productos.controller.js";


const router = Router();

router.get("/", getAllProductos);
router.get("/:id", getProductoById);
router.get("/modelo/:id", getProductosByModeloId);
router.post("/", createProducto);
router.put("/:id", updateProductoById);
router.delete("/:id", deleteProductoById);

export default router;