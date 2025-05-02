import { Router } from "express";

import {excelSuppliers, excelProducts, excelOrders, excelRequirements, createPDF, downloadPDF} from "../controllers/utils.controller.js"

const router = Router();

router.get("/excel/suppliers", excelSuppliers)
router.get("/excel/products",excelProducts)
router.get("/excel/orders", excelOrders)
router.get("/excel/requirements",excelRequirements)
router.post("/createPDF",createPDF)
router.post("/downloadPDF",downloadPDF)

export default router