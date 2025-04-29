const express = require("express");
const router = express.Router();
const pago_empleadoControll = require("../controllers/pago_empleadoControll")
router.post("/",pago_empleadoControll.agregar);
module.exports = router;