const express= require('express');
const router = express.Router(); 
const empleadosController = require('../controllers/empleadosControllers.js')
router.get('/', empleadosController.consular);
router.post('/', empleadosController.agregar);
router.put('/activacion/:id', empleadosController.reactivar);
router.route('/:id')
    .get(empleadosController.consultar_uno)
    .put(empleadosController.actualizar)
    .delete(empleadosController.eliminar)
module.exports=router;