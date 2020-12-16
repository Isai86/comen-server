const Productos = require('../models/productos');
const { validationResult } = require('express-validator');


exports.crearProducto = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //extraer email y password
    const { nombre } = req.body;

    try {
        // let producto = await Productos.findOne({ nombre });

        /* if (producto) {
            return res.status(400).json({ msg: 'El producto ya existe' });
        } */


        //Crear un producto 
        producto = new Productos(req.body);

        //Guardar el creador via JWT
        producto.creador = req.lugar.id;


        //Se guarda el producto
        producto.save();
        res.json(producto)

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }

}

//Obtiene todos los productos del usuario actual
exports.obtenerProductos = async(req, res) => {
    try {
        const productos = await Productos.find({ creador: req.lugar.id });
        res.json({ productos });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Atualiza un producto
exports.actualizarProducto = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { nombre, avatar } = req.body;
    const nuevoProducto = {};
    if (nombre, avatar) {
        nuevoProducto.nombre = nombre;
        nuevoProducto.avatar = avatar;
    }

    try {

        //revisar el ID
        let producto = await Productos.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (producto.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ACTUALIZAR
        proyecto = await Productos.findByIdAndUpdate({ _id: req.params.id }, {
            $set: nuevoProducto
        }, { new: true });

        res.json({ producto });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Eliminar un producto

exports.eliminarProducto = async(req, res) => {
    try {

        //revisar el ID
        let producto = await Productos.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (producto.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ELIMINAR EL PROYECTO
        await Productos.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Producto Eliminado" });




    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Obtiene todos los datos de el producto
exports.obtenerUnProducto = async(req, res) => {

    try {

        //revisar el ID
        let productoData = await Productos.findById(req.params.id);


        //VALIDAR SI EL PRODUCTO EXISTE O NO
        if (!productoData) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        res.json({ productoData });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}