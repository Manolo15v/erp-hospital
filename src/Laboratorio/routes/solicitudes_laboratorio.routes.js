import { Router } from "express";
import { getAll, getById, getByModulo, create, updateById, deleteById } from "../controllers/solicitudes_laboratorio.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.get("/modulo/:modulo", getByModulo); 
router.post("/", create);
router.put("/:id", updateById);
router.delete("/:id", deleteById);

export default router;