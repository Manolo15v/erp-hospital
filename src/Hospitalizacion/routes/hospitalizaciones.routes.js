import { Router } from "express";
import { getAllHospitalizaciones,  getByIdHospitalizaciones, createHospitalizaciones, finalizarHospitalizacion, deleteByIdHospitalizacion} from "../controllers/hospitalizaciones.controller.js";

const router = Router();

router.get("/", getAllHospitalizaciones);
router.get("/:id", getByIdHospitalizaciones);
router.post("/", createHospitalizaciones);
router.put("/:id", finalizarHospitalizacion);
router.delete("/:id", deleteByIdHospitalizacion); 

export default router;