import { Router } from "express";

import {loginQ,save_json} from "../controllers/login.controller.js"

const router = Router();

router.get("/", loginQ)
router.post("/save",save_json)

export default router