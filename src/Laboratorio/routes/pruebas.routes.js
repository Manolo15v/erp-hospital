import express from "express";
const router = express.Router();
import { getAllPruebas, getPruebaById, createPrueba, updatePrueba, deletePrueba, getPruebasByTipo, getPruebasByPrioridad } from "../controllers/pruebas_lab.controller.js";

// Rutas para Gestión de Pruebas de Laboratorio
router.get('/', getAllPruebas); // Obtener todas las pruebas de laboratorio
router.get('/:id', getPruebaById); // Obtener prueba por ID
router.post('/', createPrueba); // Crear nueva prueba de laboratorio
router.put('/:id', updatePrueba); // Actualizar prueba de laboratorio
router.delete('/:id', deletePrueba); // Eliminar prueba de laboratorio

// Rutas de gestión de pruebas de laboratorio
router.get('/tipo/:tipo', getPruebasByTipo); // Obtener pruebas por tipo
router.get('/prioridad', getPruebasByPrioridad); // Obtener pruebas por prioridad

export default router;
