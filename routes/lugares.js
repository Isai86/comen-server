//Rutas para los lugares
const express = require('express');
const router = express.Router();
const lugarController = require('../controllers/lugaresController');
const { check } = require('express-validator');
const auth = require('../middlewares/auth');

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'Agrega un Email válido').isEmail(),
    check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 }).toLowerCase()
], lugarController.crearLugar);

router.put('/:id', auth, lugarController.actualizarLugar);

router.get('/:id', auth, lugarController.obtenerDatos);

router.post('/avatar/:id', auth, lugarController.uploadAvatar);

module.exports = router;