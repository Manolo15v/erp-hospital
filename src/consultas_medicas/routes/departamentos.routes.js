import {Router} from 'express';
import {getById, getByNombre} from '../controllers/departamentos.controller.js';

const router= Router();

router.get("/:id",getById);
router.get("/nombre/:nombre",getByNombre);

export default router;

