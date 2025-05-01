import {Router} from "express";
import { getAll} from "../controllers/departamentos.controller.js";


const router= Router();

router.get("/", getAll); //unica ruta para obtener las especialidades(en departamentos)


export default router;