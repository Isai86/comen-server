//Rutas para autenticación
const express = require('express');
const router = express.Router();
const renewToken = require('../controllers/renewTokenController');
const auth = require('../middlewares/auth');
const { validarJWT } = require('../middlewares/validar-jwt');
//Refrescar el token
//Api/renew/Lugar
router.get('/lugar', auth, renewToken.renewToken);
//Api/renew/Lugar
router.get('/user', validarJWT, renewToken.renewTokenUser);


module.exports = router;