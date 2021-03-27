const Social = require('../models/redesSociales');
const { validationResult } = require('express-validator');


exports.crearRed = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //extraer email y password
    const { titulo, avatar, descripcion } = req.body;

    try {

        //Crear un producto 
        red = new Social(req.body);

        //Guardar el creador via JWT
        red.creador = req.lugar.id;


        //Se guarda el producto
        red.save();
        res.status(200).json({ ok: true, red })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }

}

//Obtiene todos los productos del usuario actual
exports.obtenerRedes = async(req, res) => {
    try {
        const red = await Social.find({ creador: req.lugar.id });
        res.json({ red });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Obtiene todos los productos del usuario actualpara el menú
exports.obtenerRedesPage = async(req, res) => {
    try {
        const red = await Social.find({ creador: req.params.id });
        res.json({ red });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Atualiza un producto
exports.actualizarRed = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { titulo, avatar, descripcion } = req.body;
    const nuevoProducto = {};
    if (titulo, avatar, descripcion) {
        nuevoProducto.titulo = titulo;
        nuevoProducto.avatar = avatar;
        nuevoProducto.descripcion = descripcion;
    }

    try {

        //revisar el ID
        let red = await Social.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!red) {
            return res.status(404).json({ msg: 'No se encontro la red' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (red.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ACTUALIZAR
        red = await Social.findByIdAndUpdate({ _id: req.params.id }, {
            $set: nuevoProducto
        }, { new: true });

        res.status(200).json({ ok: true, red });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Eliminar un producto

exports.eliminarRed = async(req, res) => {
    try {

        //revisar el ID
        let red = await Social.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!red) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (red.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ELIMINAR EL PROYECTO
        await Social.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Red Social Eliminada" });




    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}