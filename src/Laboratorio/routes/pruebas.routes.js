import express from "express";
const router = express.Router();
import { getAllPruebas, getPruebaById, createPrueba, updatePrueba, deletePrueba } from "../controllers/pruebas_lab.controller.js";

// Rutas para Gestión de Pruebas de Laboratorio
router.get('/', getAllPruebas); // Obtener todas las pruebas de laboratorio
router.get('/:id', getPruebaById); // Obtener prueba por ID
router.post('/', createPrueba); // Crear nueva prueba de laboratorio
router.put('/:id', updatePrueba); // Actualizar prueba de laboratorio
router.delete('/:id', deletePrueba); // Eliminar prueba de laboratorio

export default router;
