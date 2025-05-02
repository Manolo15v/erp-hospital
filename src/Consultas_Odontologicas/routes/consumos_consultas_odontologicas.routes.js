import { Router } from "express";
import { getAll, create, updateByConsultaId, deleteByConsultaId } from "../controllers/consumos_consultas_odontologicas.controller.js";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", updateByConsultaId);
router.delete("/:id", deleteByConsultaId); 

export default router;