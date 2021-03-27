const Pedido = require('../models/pedidos');
const User = require('../models/user');
const Lugar = require('../models/lugar');


exports.nuevoPedido = async(req, res) => {

    try {
        const pedido = new Pedido(req.body);
        pedido.lugar = req.params.id;

        await pedido.save();
        res.status(200).json({ ok: true, pedido, msg: 'Se agregó nuevo pedido' });

    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hubo un error'
        });
    }
}

//Obtiene todos los pedidos del establecimiento
exports.mostrarPedidosLugar = async(req, res) => {

    try {

        let lugar = await Lugar.findById(req.params.id);


        //Obtener los pedidos del usuario
        const pedidos = await Pedido.find({}).populate('user').populate({
            path: 'productos.producto',
            model: 'SubProductos',

        }).populate({
            path: 'promociones.promocion',
            nodel: "Promocion"
        });
        res.json({ pedidos });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}

//Obtiene todos los pedidos del usuario
exports.mostrarPedidosUsuario = async(req, res) => {

    try {

        let user = await User.findById(req.params.id);


        //Obtener los pedidos del usuario
        const pedidos = await Pedido.find({}).populate('lugar').populate({
            path: 'productos.producto',
            model: 'SubProductos',

        }).populate({
            path: 'promociones.promocion',
            nodel: "Promocion"
        });
        res.status(200).json({ pedidos });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}



exports.mostrarUnPedido = async(req, res) => {
    try {



        //Se muestra el pedido 
        const pedido = await Pedido.find({ _id: req.params.id }).populate('lugar').populate({
            path: 'productos.producto',
            model: 'SubProductos',

        }).populate({
            path: 'promociones.promocion',
            nodel: "Promocion"
        }).populate({
            path: 'promociones.promocion',
            nodel: "Promocion"
        }).populate({
            path: 'lugar',
            nodel: "Lugar"
        }).populate({
            path: 'user',
            nodel: "User"
        });
        res.status(200).json({ ok: true, pedido });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}

exports.actualzarPedido = async(req, res) => {
    try {
        let pedido = await Pedido.findByIdAndUpdate({ _id: req.params.id }, req.body, {
            new: true
        }).populate({
            path: 'lugar',
            nodel: "Lugar"
        }).populate({
            path: 'user',
            nodel: "User"
        });;

        res.status(200).json({ ok: true, pedido, msg: "Se actualizó el pedido" })
    } catch (error) {

    }
}

//Eliminar un producto

exports.eliminarPedido = async(req, res) => {
    try {
        //Extraer el user y comprobar si existe


        //Revisar si el subproducto existe o no
        const pedido = await Pedido.findById(req.params.id);

        if (!pedido) {
            return res.status(401).json({ msg: "No existe ese Producto" });
        }


        //Eliminar un subProducto
        await Pedido.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Se elimino este pedido" });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}