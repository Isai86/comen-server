const express = require('express');
const router = express.Router();
const LikeController = require('../controllers/likecontroller');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');

//Dar like
router.post('/:id', LikeController.DarLike);

//Obtener todos los likes del usuario
router.post('/user/:id', auth, LikeController.obtenerlikesUser)

//Obtener todos los likes del lugar
router.post('/lugar/:id', LikeController.obtenerlikesLugar)

/* router.put('/:id', LikeController.actualizarLike) */
//Mostrar el like
router.get('/:id', LikeController.mostrarLike)
    //Eliminar like
router.delete('/:id', auth, [
    check('user', 'El usuario es obligatorio').not().isEmpty(),
], LikeController.eliminarLike)



module.exports = router;