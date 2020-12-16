//Rutas para autenticación
const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');
//Crear un lugar
//Api/auth
router.post('/', [
    check('email', 'Agrega un Email válido').isEmail(),
    check('password', 'El password debe de ser minimo de 6 caracteres').isLength({ min: 6 })
], authController.autenticar);



module.exports = router;