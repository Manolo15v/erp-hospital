import { Router } from "express";
import { create, deleteById, getAll, getByArea, getById, updateById } from "../controllers/almacen.controller.js";

const  router = Router();

router.get("/", getAll);
router.get("/:id", getById)
router.get("/area/:area", getByArea)
router.post("/", create);
router.put("/:id", updateById)
router.delete("/:id", deleteById)

export default router