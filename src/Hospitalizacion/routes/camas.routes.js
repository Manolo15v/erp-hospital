import { Router } from "express";
import { getAll,  getById, create, updateById, deleteById } from "../controllers/camas.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", updateById);
router.delete("/:id", deleteById); 

export default router;