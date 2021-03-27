//Rutas para los Usuarios
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un Email válido').isEmail(),
    check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 }).toLowerCase()
], userController.crearUsuario);

//Actualiza los datos del usuario
router.put('/:id', auth, userController.actualizarUsuario);

//Obtiene datos del usuario 
router.get('/:id', auth, userController.obtenerDatos);

//Obtiene datos del usuario para el sitio web
router.get('/page/:id', userController.obtenerDatos);

//Coloca foto de avatar del perfil del usuario 
router.post('/avatar/:id', auth, userController.uploadAvatar);

//Enviar email si el usuario existe 
router.post('/verificaremail', userController.verificarEmail);

router.put('/cambiarPassword/usuario/:token', userController.reestablecerEmail);

router.put('/activarusuario/:token', auth, userController.activarUsuario);

module.exports = router;