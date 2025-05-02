import express from 'express';
import { 
    updateInventarioConsultorio,
    getInsumosConsultorio
 } from '../controllers/insumos.controller.js';

const router = express.Router();

router.get('/api/consultas/insumos/consultorio', getInsumosConsultorio);
router.post('/api/consultas/insumos/actualizar', updateInventarioConsultorio);

export default router;
