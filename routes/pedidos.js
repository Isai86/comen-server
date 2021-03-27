const express = require('express');
const router = express.Router();
const pedidosController = require('../controllers/pedidosController');
const auth = require('../middlewares/auth');

//Crear un pedido
router.post('/:id', auth, pedidosController.nuevoPedido)

router.get('/lugar/:id', auth, pedidosController.mostrarPedidosLugar)

router.get('/user/:id', auth, pedidosController.mostrarPedidosUsuario)

router.get('/:id', auth, pedidosController.mostrarUnPedido)

router.put('/:id', auth, pedidosController.actualzarPedido)

router.delete('/:id', auth, pedidosController.eliminarPedido)


module.exports = router;