import { Router } from "express";
import { eliminarYReorganizarEmpleado,agregar,actualizar} from "../controllers/pagos_empleados.controller.js";

const router = Router();

router.post("/",agregar);
router.put("/:id",actualizar);
router.delete("/:id",eliminarYReorganizarEmpleado);

export default router;