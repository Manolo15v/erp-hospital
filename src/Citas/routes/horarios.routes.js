import {Router} from 'express';
import{getAll, obtenerTurno, verificarPorHorario} from '../controllers/horarios.controllers.js';


const router= Router();

router.get("/", getAll);
router.get("/turno/horario", obtenerTurno); //Manuel cuando leas esto, verifica si puse la ruta bien
router.get("/verificar/:horario_id", verificarPorHorario); //lo mismo aqui


export default router;