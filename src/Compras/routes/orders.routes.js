import { Router } from "express";

import {getAllOrders, getByIdOrders, insertOrder, updateOrder, deleteOrder} from "../controllers/orders.controller.js"

const router = Router();

router.get("/", getAllOrders)
router.get("/:id",getByIdOrders)
router.post("/",insertOrder)
router.put("/:id",updateOrder)
router.delete("/:id",deleteOrder)

export default router