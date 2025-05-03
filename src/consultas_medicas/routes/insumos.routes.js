import express from 'express';
import { 
    updateInventarioConsultorio,
    getInsumosConsultorio
 } from '../controllers/insumosController.js';

const router = express.Router();

router.get('/', getInsumosConsultorio);
router.post('/actualizar', updateInventarioConsultorio);

export {router};
