import { Router } from "express";
import { eliminarYReorganizarEmpleado,agregar,actualizar} from "../controllers/pago_empleadoControll.js";
const router = Router();
router.post("/",agregar);
router.put("/:id",actualizar);
router.get("/:id",eliminarYReorganizarEmpleado);

export default router;