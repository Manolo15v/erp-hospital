import { Router } from "express";
import {getById, create } from "../controllers/signos_vitales.controller.js";

const router = Router();

router.get("/:id", getById);
router.post("/", create);

export default router;