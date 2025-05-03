import{Router} from 'express';
import {getOrders,getPayments,getIncome,getGraph,getAll} from '../controllers/datos.controller.js';

const router= Router();

router.get("/orders",getOrders);
router.get("/payments",getPayments);
router.get("/income",getIncome);
router.get("/graph",getGraph);
router.get("/all",getAll);


export default router;
















