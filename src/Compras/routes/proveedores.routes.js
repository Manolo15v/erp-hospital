import { Router } from "express";

import {deleteSupplier, getAllSuppliers, getByIdSuppliers, insertSupplier, updateSupplier} from "../controllers/proveedores.controller.js"

const router = Router();

router.get("/", getAllSuppliers)
router.get("/:id",getByIdSuppliers)
router.post("/",insertSupplier)
router.put("/:id",updateSupplier)
router.delete("/:id",deleteSupplier)

export default router