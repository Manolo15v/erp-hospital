import express from 'express';
import {
    getConsultas,
    getConsultasCompletada,
    getConsultasPendiente,
    searchConsultations,
    createConsulta,
    createHistoria,
    getConsultaById,
    updateConsulta,
    updateHistoria,
    deleteConsulta,
    getConsultasTotalCount,
    getConsultasCompletadasCount,
    getConsultasPendientesCount,
    crearHospitalizacion,
    upload
} from '../controllers/consultasController.js';

const router = express.Router();

router.get('/', getConsultas); 
router.get('/completadas', getConsultasCompletada);
router.get('/pendientes', getConsultasPendiente);
router.get('/search', searchConsultations);
router.get('/stats/total', getConsultasTotalCount);
router.get('/stats/completadas', getConsultasCompletadasCount);
router.get('/stats/pendientes', getConsultasPendientesCount);
router.get('/:id', getConsultaById);

router.post('/', createConsulta);
router.post('/:id/historia', upload.single('archivo'), createHistoria);
router.post('/hospitalizacion', crearHospitalizacion);

router.put('/:id', updateConsulta);
router.put('/historia/:id', upload.single('archivo'), updateHistoria);

router.delete('/:id', deleteConsulta);

export {router};