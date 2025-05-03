import {Router} from "express";
import { updateOrder} from "../controllers/ordencompra.controller";


const router= Router();

router.put("/",updateOrder);

export default router;