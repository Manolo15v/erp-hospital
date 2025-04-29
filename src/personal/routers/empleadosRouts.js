import { Router } from "express";
import { consultar,consultar_uno,eliminar,actualizar,agregar,reactivar } from "../controllers/empleadosControllers.js";
const router = Router();

router.get('/', consultar);
router.post('/', agregar);
router.put('/activacion/:id', reactivar);
router.route('/:id')
    .get(consultar_uno)
    .put(actualizar)
    .delete(eliminar)

export default router;
