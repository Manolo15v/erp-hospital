import { Router}  from "express";
import{createCita, deleteCita, updateCita, getAll} from "../controllers/citas.controller.js";

const router= Router();

router.get("/", getAll); //obtiene las citas que ya haya(ninguna creo)
router.post("/", createCita); //crea una cita
router.delete("/:id", deleteCita); //elimina citas en historial 
router.put("/:id", updateCita); //reprograma citas

export default router;
