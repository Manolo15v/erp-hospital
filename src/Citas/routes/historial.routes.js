import { Router}  from "express";
import{getAllCitas, borrarCita} from "../controllers/historial.controller.js";

const router= Router();

router.get("",getAllCitas);
router.delete("/:id", borrarCita);

export default router;