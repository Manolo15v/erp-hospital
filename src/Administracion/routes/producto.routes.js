import {Router} from 'express';

import {getAll, getById, createProducto} from '../controllers/producto.controllers.js';

const router= Router();

router.get("/",getAll);
router.get("/:id",getById);
router.post("/",createProducto);

export default router;

