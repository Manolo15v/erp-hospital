import { Router } from "express";
import {getAllInventory} from "../controllers/inventory.controller.js"

const router = Router();

router.get("/",getAllInventory)

export default router
