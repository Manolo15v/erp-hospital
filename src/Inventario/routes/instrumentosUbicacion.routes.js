import { Router } from "express";
import { createUbicacion, deleteUbicacionById, getAllUbicaciones, getUbicacionesByInstrumentoId, getUbicacionesByUbicacionId, updateUbicacionById } from "../controllers/instrumentosUbicacion.controller.js";

const router = Router();
router.get("/", getAllUbicaciones);
router.get("/instrumento/:id", getUbicacionesByInstrumentoId);
router.get("/ubicacion/:id", getUbicacionesByUbicacionId);
router.post("/", createUbicacion);
router.put("/:Id_Instrumento/:Id_Ubicacion", updateUbicacionById);
router.delete("/:Id_Instrumento/:Id_Ubicacion", deleteUbicacionById);

export default router;