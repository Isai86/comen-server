const express = require('express');
const router = express.Router();
const slideController = require('../controllers/slideController');
const auth = require('../middlewares/auth');

//Crear un pruductos
//Api/productos
router.post('/', auth, slideController.crearSlide)

//Obtener todos los productos
router.get('/', auth, slideController.obtenerSlides)

//Obtener todos los productos para la pagina principal
router.get('/:id', slideController.obtenerSlidesPagina)

//Actualizar producto via ID
router.put('/:id', auth, slideController.actualizarSlide)

//Eliminar un producto
router.delete('/:id', auth, slideController.eliminarSlide)

/* //Obtener un producto
router.get('/:id', auth, promocionController.obtenerUnProducto); */

router.post('/avatar', auth, slideController.uploadSlide)

//Subir imagen
router.post('/avatar/:id', auth, slideController.uploadSlidePromo)


module.exports = router;