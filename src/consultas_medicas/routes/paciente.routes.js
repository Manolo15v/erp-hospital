import {Router} from 'express';
import { getAllPacientes, getPacienteById, createPaciente, getAllMedicos, getPacienteByCedula} from '../controllers/paciente.controller.js';


const router= Router();

router.get("/", getAllPacientes);
router.get("/medicos", getAllMedicos);
router.get("/:id", getPacienteById);
router.get("/cedula/:cedula", getPacienteByCedula);
router.post("/", createPaciente);

export {router};