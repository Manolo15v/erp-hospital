import express from "express";
const router = express.Router();
import { getAllSolicitudes, getSolicitudById, createSolicitud, updateSolicitud, deleteSolicitud } from "../controllers/solicitudes_lab.controller.js";

// Rutas para Gestión de Solicitudes
router.get('/', getAllSolicitudes); // Obtener todas las solicitudes de laboratorio
router.get('/:id', getSolicitudById); // Obtener solicitud por ID
router.post('/', createSolicitud); // Crear nueva solicitud de laboratorio
router.put('/:id', updateSolicitud); // Actualizar solicitud de laboratorio
router.delete('/:id', deleteSolicitud); // Eliminar solicitud de laboratorio

export default router;
