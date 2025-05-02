import { Router } from "express";
import { getAllPacientes,  getById, getByCedula, createPaciente, updateById, deleteById } from "../controllers/pacientes.controller.js";

const router = Router();

router.get("/", getAllPacientes);
router.get("/:id", getById);
router.get("/cedula/:cedula", getByCedula);
router.post("/", createPaciente);
router.put("/:id", updateById);
router.delete("/:id", deleteById); 

export default router;