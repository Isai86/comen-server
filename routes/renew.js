//Rutas para autenticación
const express = require('express');
const router = express.Router();
const renewToken = require('../controllers/renewTokenController');
const { validarJWT } = require('../middlewares/validar-jwt');
//Refrescar el token
//Api/renew
router.get('/', validarJWT, renewToken.renewToken);

module.exports = router;