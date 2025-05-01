import { Router } from "express";
import { getAll,  getByPacienteId, create, deleteById } from "../controllers/lista_espera_hospitalizacion.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getByPacienteId);
router.post("/", create);
router.delete("/:id", deleteById); 

export default router;