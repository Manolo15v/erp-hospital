import { Router } from "express";
import { getAll,  getByHabitacionId, create, updateById, deleteById } from "../controllers/camas.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getByHabitacionId);
router.post("/", create);
router.put("/:id", updateById);
router.delete("/:id", deleteById); 

export default router;