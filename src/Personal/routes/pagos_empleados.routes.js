import { Router } from "express";
import { eliminarYReorganizarEmpleado,agregar,actualizar,cargar,obtener} from "../controllers/pagos_empleados.controller.js";

const router = Router();

router.get("/",cargar)
router.get("/:id",obtener);
router.post("/",agregar);
router.put("/:id",actualizar);
router.delete("/:id",eliminarYReorganizarEmpleado);

export default router;