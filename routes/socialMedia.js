const express = require('express');
const router = express.Router();
const SocialController = require('../controllers/socialMediaController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Crear un pruductos
//Api/productos
router.post('/', auth, [
    check('titulo', 'El nombre de la red es obligatorio').not().isEmpty(),
    check('descripcion', 'La url de la red social es obligatoria').not().isEmpty()
], SocialController.crearRed)

//Obtener todos los productos
router.get('/', auth, SocialController.obtenerRedes)

//Obtener todos los productos para la pagina
router.get('/:id', SocialController.obtenerRedesPage)

//Actualizar producto via ID
router.put('/:id', auth, [
    check('titulo', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('descripcion', 'La url de la red social es obligatoria').not().isEmpty()
], SocialController.actualizarRed)

//Eliminar un producto
router.delete('/:id', auth, SocialController.eliminarRed)

module.exports = router;