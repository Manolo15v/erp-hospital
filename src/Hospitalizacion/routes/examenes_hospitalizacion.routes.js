import { Router } from "express";
import { getAllExamenes,  getByHospitalizacionId, getByHospitalizacionIdAndTitle, createExamen, updateByHospitalizacionId } from "../controllers/examenes_hospitalizacion.controller.js";

const router = Router();

router.get("/", getAllExamenes);
router.get("/:id", getByHospitalizacionId);
router.get("/:id/:titulo", getByHospitalizacionIdAndTitle);
router.post("/", createExamen);
router.put("/:id/:titulo", updateByHospitalizacionId);

export default router;