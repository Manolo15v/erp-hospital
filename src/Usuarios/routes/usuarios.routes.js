import { Router } from "express";
import { cargar,agregar,actualizar,obtener,actualizarClave} from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/",cargar);
router.post("/",agregar);
router.put("/:id",actualizar);
router.put("/clave/:id",actualizarClave);
router.get("/:id",obtener);

export default router;