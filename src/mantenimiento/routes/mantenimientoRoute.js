import { Router } from 'express';
import { listarMantenimientos, 
         obtenerEquiposRepuestos, 
         registrarMantenimiento, 
         eliminarMantenimiento, 
         obtenerMantenimientoEdicion, 
         actualizarMantenimientoController,
         cambiarEstadoSolicitudController,
         cambiarEstadoEliminadoController,
         cambiarEstadoCompletadoController} from '../controllers/mantenimientoController.js';

const router = Router();

router.get('/lista', listarMantenimientos);
router.get('/datosFormulario', obtenerEquiposRepuestos);
router.post('/registro', registrarMantenimiento);
router.delete('/eliminar/:id', eliminarMantenimiento);
router.get('/actualizar/:id', obtenerMantenimientoEdicion);
router.put('/enviar/:id', actualizarMantenimientoController);
router.put('/solicitudes/estado/:id', cambiarEstadoSolicitudController);
router.put('/solicitudes/eliminado/:id', cambiarEstadoEliminadoController);
router.put('/solicitudes/completado/:id', cambiarEstadoCompletadoController);

export default router;