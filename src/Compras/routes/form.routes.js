import { Router } from "express";

import {getOrdersResults,getProductsResults,getRequirementsResults,getSuppliersResults} from "../controllers/form.controller.js"

const router = Router();

router.get("/Orders/:id", getOrdersResults)
router.get("/Products/:id",getProductsResults)
router.get("/Requirements/:id",getRequirementsResults)
router.get("/Suppliers/:id",getSuppliersResults)

export default router