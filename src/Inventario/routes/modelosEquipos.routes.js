import { Router } from "express";
import { createModelo, deleteById, getAll, getById, updateById } from "../controllers/modelos_equipos.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", createModelo);
router.put("/:id", updateById);
router.delete("/:id", deleteById);


export default router