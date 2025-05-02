import{Router} from 'express';
import {getAll, getById, createOrdenCompra, updateOrdenCompra, deleteOrdenCompra} from '../controllers/ordenCompra.controllers.js';

const router= Router();

router.get("/",getAll);
router.get("/:id",getById);
router.post("/",createOrdenCompra);
router.put("/:id",updateOrdenCompra);
router.delete("/:id",deleteOrdenCompra);

export default router;
















