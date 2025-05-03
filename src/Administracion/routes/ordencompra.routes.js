import {Router} from "express";
import { updateOrder} from "../controllers/ordencompra.controller.js";


const router= Router();

router.put("/",updateOrder);

export default router;