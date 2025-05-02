import {Router} from 'express';

import { getCitasById, ReprogramarCita } from '../controllers/reprogramar.controller.js';



const router= Router();

router.get('/paciente_id', getCitasById); 
router.get('/:id', ReprogramarCita); 


export default router;