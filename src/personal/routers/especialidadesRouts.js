const express = require("express");
const router = express.Router();
const especialidadesControll = require("../controllers/especialidadControll.js")
router.get("/",especialidadesControll.cargar);
router.post("/",especialidadesControll.agregar);
router.put("/:id",especialidadesControll.actualizar);
router.get("/:id",especialidadesControll.obtener);
module.exports = router;