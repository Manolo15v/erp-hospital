import { Router } from "express";
import { create, deleteById, getAll, getById, updateById } from "../controllers/repuestos.controller.js";

const router = Router()

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", updateById);
router.delete("/:id", deleteById);

export default router