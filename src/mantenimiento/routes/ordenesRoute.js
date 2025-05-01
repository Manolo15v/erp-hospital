import { Router } from 'express';
import { cambiarPrioridadController, 
         cambiarPrioridadEliminadaController, 
         crearOrdenTrabajoController, 
         obtenerEmpleadoController, 
         ordenesTrabajoController } from '../controllers/ordenTrabajoController.js';

const router = Router();

router.get('/empleadoOrden', obtenerEmpleadoController);
router.post('/crearOrden', crearOrdenTrabajoController);
router.get('/obtenerOrdenesTrabajo/:prioridad', ordenesTrabajoController);
router.delete('/eliminarOrdenTrabajo/:id', cambiarPrioridadEliminadaController);
router.put('/prioridad/:id', cambiarPrioridadController);

export default router;