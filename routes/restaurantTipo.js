const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/tipoRestaurantController');
const auth = require('../middlewares/auth');

//Crear un pruductos
//Api/productos
router.post('/', auth, restaurantController.crearRestaurant);

router.get('/', auth, restaurantController.obtenerRestaurant);




module.exports = router;