const express = require('express');
const router = express.Router();
const ComentController = require('../controllers/comentarioCOntroller');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Escribir comentario
router.post('/:id', ComentController.AgregarComentario);

//Obtener todos los likes del usuario
router.post('/user/:id', auth, ComentController.obtenerComentariosUser)

//Obtener todos los likes del lugar
router.post('/lugar/:id', ComentController.obtenerCOmentariosLugar)

/* router.put('/:id', LikeController.actualizarLike) */

//Eliminar like
router.delete('/:id', auth, [
    check('user', 'El usuario es obligatorio').not().isEmpty(),
], ComentController.eliminarComentario)



module.exports = router;