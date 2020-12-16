const express = require('express');
const router = express.Router();
const productoController = require('../controllers/productosController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Crear un pruductos
//Api/productos
router.post('/', auth, [
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty()
], productoController.crearProducto)

//Obtener todos los productos
router.get('/', auth, productoController.obtenerProductos)

//Actualizar producto via ID
router.put('/:id', auth, [
    check('nombre', 'El nombre del producto es obligatorio').not().isEmpty()
], productoController.actualizarProducto)

//Eliminar un producto
router.delete('/:id', auth, productoController.eliminarProducto)

//Obtener un producto
router.get('/:id', auth, productoController.obtenerUnProducto);


module.exports = router;