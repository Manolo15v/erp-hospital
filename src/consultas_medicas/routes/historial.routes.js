import express from 'express';
import {
    getHistorias,
    getHistoriaId,
    createHistoria,
    updateHistoria,
    deleteHistoria,
    upload
} from '../controllers/historial.controller.js';

const router = express.Router();

router.get('/api/historiales', getHistorias);
router.get('/api/historiales/:id', getHistoriaId);
router.post('/api/historiales', upload.single('archivo'), createHistoria);
router.put('/api/historiales/:id', upload.single('archivo'), updateHistoria);
router.delete('/api/historiales/:id', deleteHistoria);

export default router;