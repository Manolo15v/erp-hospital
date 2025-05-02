import { Router } from "express";

import {allData,empleoyees,orders,products,requirements,suppliers} from "../controllers/table.controller.js"

const router = Router();

router.get("/allData", allData)
router.get("/empleoyees",empleoyees)
router.get("/orders",orders)
router.get("/products",products)
router.get("/requirements",requirements)
router.get("/suppliers",suppliers)

export default router