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
} from '../controllers/consultas.controller.js';

const router = express.Router();

router.get('/api/consultas', getConsultas);
router.get('/api/consultas/completadas', getConsultasCompletada);
router.get('/api/consultas/pendientes', getConsultasPendiente);
router.get('/api/consultas/search', searchConsultations);
router.get('/api/consultas/stats/total', getConsultasTotalCount);
router.get('/api/consultas/stats/completadas', getConsultasCompletadasCount);
router.get('/api/consultas/stats/pendientes', getConsultasPendientesCount);
router.get('/api/consultas/:id', getConsultaById);

router.post('/api/consultas', createConsulta);
router.post('/api/consultas/:id/historia', upload.single('archivo'), createHistoria);
router.post('/api/consultas/hospitalizacion', crearHospitalizacion);

router.put('/api/consultas/:id', updateConsulta);
router.put('/api/consultas/historia/:id', upload.single('archivo'), updateHistoria);

router.delete('/api/consultas/:id', deleteConsulta);

export default router;