import {Router} from 'express';

import {getAll, getById, updateCita, deleteCita, createCita}  from "../controllers/citasmedicas.controller.js";

const router= Router();

router.get("/",getAll);
router.get("/:id",getById);
router.put("/:id",updateCita);
router.delete("/:id",deleteCita);
router.post("/", createCita);

export default router;