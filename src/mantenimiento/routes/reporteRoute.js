import { Router } from 'express';
import { lista } from '../controllers/reporteController.js';

const router = Router();

router.get('/lista', lista);

export default router;