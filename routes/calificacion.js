const express = require('express');
const router = express.Router();
const calificacionController = require('../controllers/calificacionController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Escribir comentario
router.post('/:id', calificacionController.AgregarCalificacion);

//Obtener todos los likes del usuario
router.post('/user/:id', auth, calificacionController.obtenerCalificacion)

//Obtener todos los likes del lugar
router.post('/lugar/:id', calificacionController.obtenerCalificacionLugar)

router.put('/:id', calificacionController.obtenerCalificacion)

//Eliminar like
router.delete('/:id', auth, [
    check('user', 'El usuario es obligatorio').not().isEmpty(),
], calificacionController.eliminarCalificacion)



module.exports = router;