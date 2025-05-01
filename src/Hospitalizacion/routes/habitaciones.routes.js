import { Router } from "express";
import { getAllHabitaciones,  getByIdHabitaciones, createHabitaciones, updateById, deleteByIdHabitacion } from "../controllers/habitaciones.controller.js";

const router = Router();

router.get("/", getAllHabitaciones);
router.get("/:id", getByIdHabitaciones);
router.post("/", createHabitaciones);
router.put("/:id", updateById);
router.delete("/:id", deleteByIdHabitacion); 

export default router;