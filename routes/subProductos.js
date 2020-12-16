const express = require('express');
const router = express.Router();
const sPController = require('../controllers/subProductosController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');


//Crear un subpruducto
//Api/subproductos
router.post('/', auth, [
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('precio', 'El precio del producto es obligatorio').not().isEmpty(),
], sPController.crearunsp);

//obtener los subProductos por producto
router.get('/', auth, sPController.obtenersp);

//Actualizar SubProducto
router.put('/:id', auth, [
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty()
], sPController.actualizarsp)

//Eliminar un SubProducto
router.delete('/:id', auth, sPController.eliminarsp)

module.exports = router;