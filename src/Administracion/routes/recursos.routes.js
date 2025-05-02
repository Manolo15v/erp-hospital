import{Router} from 'express';
import {getAll,getById,createRecurso,updateRecurso,deleteRecurso}   from '../controllers/recursos.controllers.js';

const router= Router();


router.get("/",getAll);
router.get("/:id",getById);
router.post("/",createRecurso);
router.put("/:id",updateRecurso);
router.delete("/:id",deleteRecurso);

export default router;