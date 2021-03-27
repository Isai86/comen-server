const express = require('express');
const router = express.Router();
const CategoriaController = require('../controllers/categoryController');
const auth = require('../middlewares/auth');
const { check } = require('express-validator');


//Falta crear ek middleware de privilegios de administrador, asi como todo lo relacionado con el administrador
//Escribir comentario
router.post('/', auth, CategoriaController.crearCategoria);

//Obtener todas las categoryas
router.get('/', auth, CategoriaController.obtenerCategorias)





module.exports = router;