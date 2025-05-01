import express from "express";
const router = express.Router();
import { getAllPacientes, getPacienteById, createPaciente, updatePaciente, deletePaciente, getPacienteHistorial, getPacienteResultados } from "../controllers/pacientes_lab.controller.js";

// Rutas para Gestión de Pacientes
router.get('/', getAllPacientes); // Obtener todos los pacientes del laboratorio
router.get('/:id', getPacienteById); // Obtener paciente por ID
router.post('/', createPaciente); // Crear nuevo paciente
router.put('/:id', updatePaciente); // Actualizar información del paciente
router.delete('/:id', deletePaciente); // Eliminar paciente

// Rutas específicas de pacientes del laboratorio
router.get('/:id/historial', getPacienteHistorial); // Obtener historial médico del paciente
router.get('/:id/resultados', getPacienteResultados); // Obtener resultados de exámenes del paciente

export default router;
