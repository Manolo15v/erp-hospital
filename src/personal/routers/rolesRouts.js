import { Router } from "express";
import { cargar,agregar,actualizar,obtener} from "../controllers/rolesControll.js";
const router = Router();
router.get("/",cargar);
router.post("/",agregar);
router.put("/:id",actualizar);
router.get("/:id",obtener);

export default router;