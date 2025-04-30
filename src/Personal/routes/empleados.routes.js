import { Router } from "express";
import { consultar,consultar_uno,eliminar,actualizar,agregar,reactivar } from "../controllers/empleados.controller.js";

const router = Router();

router.get('/', consultar);
router.post('/', agregar);
router.put('/activacion/:id', reactivar);
router.put('/:id',actualizar);
router.get('/:id',consultar_uno);
router.delete('/:id',eliminar);

export default router;
