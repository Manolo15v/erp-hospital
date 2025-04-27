import { Router } from "express";
import { createEquipo, deleteEquipoById, getAllEquipos, getEquipoByModeloId, getEquiposById, updateEquipoById } from "../controllers/equipos.controller.js";

const router = Router();

router.get("/", getAllEquipos);
router.get("/:id", getEquipoByModeloId);
router.get("/modelo/:id", getEquiposById);
router.post("/", createEquipo);
router.put("/:id", updateEquipoById);
router.delete("/:id", deleteEquipoById);
export default router;