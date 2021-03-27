//Rutas para los lugares
const express = require('express');
const router = express.Router();
const lugarController = require('../controllers/lugaresController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/', [
    check('email', 'Agrega un Email válido').isEmail(),
    check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 }).toLowerCase()
], lugarController.crearLugar);

router.put('/:id', auth, lugarController.actualizarLugar);

router.put('/abrir_cerrar/:id', auth, lugarController.openCLoseLugar);

//Obtiene datos del usuario para editar en el admin
router.get('/:id', auth, lugarController.obtenerDatos);

//Obtiene datos del usuario, para mostrar en su perfil
router.get('/perfil/:id', lugarController.obtenerDatos);

//Obtiene todos los lugares
router.get('/', auth, lugarController.obtenerComidas);

//Obtiene el logog del lugar
router.post('/avatar/:id', lugarController.uploadAvatar);

router.post('/location', auth, lugarController.obtenerRapida);


module.exports = router;