const express = require('express');
const router = express.Router();
const promocionController = require('../controllers/promocionController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Crear un pruductos
//Api/productos
router.post('/', auth, [
    check('titulo', 'El nombre del producto es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty()
], promocionController.crearPromocion)

//Obtener todos los productos
router.get('/', auth, promocionController.obtenerPromociones)

//Actualizar producto via ID
router.put('/:id', auth, [
    check('titulo', 'El titulo del producto es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripción es obligatoria').not().isEmpty()
], promocionController.actualizarPromocion)

//Eliminar un producto
router.delete('/:id', auth, promocionController.eliminarPromocion)

/* //Obtener un producto
router.get('/:id', auth, promocionController.obtenerUnProducto); */

router.post('/avatar/:id', auth, promocionController.uploadAvatarPromo)


module.exports = router;