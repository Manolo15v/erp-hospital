import { Router } from "express";

import { codeProduct, deleteProduct, getAllProducts, getByIdProducts, insertProduct, updateProducts } from "../controllers/recursos.controller.js"

const router = Router();

router.get("/codigo",codeProduct)
router.get("/", getAllProducts)
router.get("/:id",getByIdProducts)
router.post("/",insertProduct)
router.put("/:id",updateProducts)
router.delete("/:id",deleteProduct)

export default router