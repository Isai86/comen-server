const express = require('express');
const router = express.Router();
const direccionController = require('../controllers/direccionsController');
const auth = require('../middlewares/auth');

//Crear un pruductos
//Api/productos
router.post('/', auth, direccionController.crearDireccion)

//Obtener todos los productos
router.get('/', auth, direccionController.obtenerLocalizacion)

//Obtener todos los productos para la pagina principal
router.get('/:id', direccionController.obtenerDireccionPagina)

//Actualizar producto via ID
router.put('/:id', auth, direccionController.actualizarDireccion)

//Eliminar un producto
router.delete('/:id', auth, direccionController.eliminarDireccion)

//Obtener todas las direcciones
router.post('/rutas', direccionController.obtenerTodosLosLugares)

module.exports = router;