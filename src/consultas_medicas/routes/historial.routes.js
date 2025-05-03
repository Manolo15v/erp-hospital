import express from 'express';
import {
    getHistorias,
    getHistoriaId,
    createHistoria,
    updateHistoria,
    deleteHistoria,
    upload
} from '../controllers/historialController.js';

const router = express.Router();

router.get('/', getHistorias);
router.get('/:id', getHistoriaId);
router.post('/', upload.single('archivo'), createHistoria);
router.put('/:id', upload.single('archivo'), updateHistoria);
router.delete('/:id', deleteHistoria);

export {router};