import express from 'express';
import { getAllExamenes, getExamenById, createExamen, updateExamen, deleteExamen, getExamenesByCategoria, getExamenesByPrecio, getExamenesDisponibles } from '../controllers/examenes_lab.controller.js';
const router = express.Router();

// Rutas para Gestión de Exámenes
router.get('/', getAllExamenes); // Obtener todos los exámenes disponibles
router.get('/:id', getExamenById); // Obtener examen por ID
router.post('/', createExamen); // Crear nuevo examen
router.put('/:id', updateExamen); // Actualizar información del examen
router.delete('/:id', deleteExamen); // Eliminar examen

// Rutas de gestión de exámenes
router.get('/categoria/:categoria', getExamenesByCategoria); // Obtener exámenes por categoría
router.get('/precio', getExamenesByPrecio); // Obtener exámenes por rango de precio
router.get('/disponibles', getExamenesDisponibles); // Obtener exámenes disponibles

export default router;
