import {Router} from 'express';
import { getAllPacientes, getPacienteById, createPaciente} from '../controllers/paciente.controller.js';


const router= Router();

router.get("/", getAllPacientes);
router.get("/:id", getPacienteById);
router.post("/", createPaciente);

export default router;