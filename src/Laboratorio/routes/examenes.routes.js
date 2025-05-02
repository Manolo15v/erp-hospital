import express from 'express';
import {
    getAllExamenes,
    getExamenById,
    createExamen,
    updateExamen,
    deleteExamen,
    getExamenesByTipo,
    getExamenesByFecha,
    getExamenesByEstado,
    getExamenesPendientes
} from '../controllers/examenes_lab.controller.js';

const router = express.Router();

//Rutas generales para la gestión de exámenes
router.get('/', getAllExamenes);
router.get('/:id', getExamenById);
router.post('/', createExamen);
router.put('/:id', updateExamen);
router.delete('/:id', deleteExamen);

//Rutas específicas para el filtrado de historial de exámenes
router.get('/tipo/:tipo_examen', getExamenesByTipo);
router.get('/fecha', getExamenesByFecha);
router.get('/estado/:estado', getExamenesByEstado);
router.get('/pendientes', getExamenesPendientes);

export default router;
