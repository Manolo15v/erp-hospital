import express from "express";
const router = express.Router();
import { getAllResultados, getResultadosByPaciente, getResultadosByEstado, getResultadosByFecha, getResultadosByTipo, getResultadosByFilters } from "../controllers/resultados_lab.controller.js";
import { getAllPacientes } from "../controllers/pacientes_lab.controller.js";

// Rutas para Gestión de Resultados
router.get('/', getAllResultados); // Obtener todos los resultados de exámenes

// Rutas de filtrado de resultados
router.get('/paciente/:pacienteId', getResultadosByPaciente); // Obtener resultados por paciente
router.get('/estado/:estado', getResultadosByEstado); // Obtener resultados por estado
router.get('/fecha', getResultadosByFecha); // Obtener resultados por fecha
router.get('/tipo/:tipo_examen', getResultadosByTipo); // Obtener resultados por tipo de examen
router.get('/filtro/:pacienteId/:estado/:tipo_examen/:fecha_inicio/:fecha_fin', getResultadosByFilters); // Obtener resultados por filtros de paciente, estado, tipo de examen y fechas
router.get('/pacientes', getAllPacientes); // Obtener lista de pacientes


export default router;
