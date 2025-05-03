import {Router} from "express";

import { getAll,getById,createIncome, deleteIncome, updateIncome } from "../controllers/income.controller.js"; 

const router= Router();


router.get("/",getAll);
router.get("/:id", getById);
router.post("/",createIncome);
router.delete("/:id",deleteIncome);
router.put("/",updateIncome);


export default router;

