import { Router } from "express";
import { getAll, getById, logIn, signIn, updateById } from "../controllers/usuarios.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", getById);

router.post("/signup", signIn);
router.post("/login", logIn);

router.put("/:id", updateById);

router.delete("/:id", );

export default router;