import express from "express";
const router = express.Router();
import { getAllResultados, createResultado, updateResultado, deleteResultado, getResultadosByPaciente } from "../controllers/resultados_lab.controller.js";

// Rutas para Gestión de Resultados
router.get('/', getAllResultados); // Obtener todos los resultados de exámenes
router.post('/', createResultado); // Crear nuevo resultado de examen
router.put('/:id', updateResultado); // Actualizar resultado de examen
router.delete('/:id', deleteResultado); // Eliminar resultado de examen

// Rutas de filtrado de resultados
router.get('/paciente/:pacienteId', getResultadosByPaciente); // Obtener resultados por paciente

export default router;
