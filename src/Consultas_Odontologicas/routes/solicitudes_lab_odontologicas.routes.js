import { Router } from "express";
import { getAll, create, updateById, deleteById } from "../controllers/solicitudes_lab_odontologicas.controller.js";

const router = Router();

router.get("/", getAll);
router.post("/", create);
router.put("/:id", updateById);
router.delete("/:id", deleteById); 

export default router;