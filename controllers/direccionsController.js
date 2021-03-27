const Direccion = require('../models/direccions');
const { validationResult } = require('express-validator');


exports.crearDireccion = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }


    try {


        const { latitude, longitude } = req.body;

        //Creamos el Producto
        const direccionlugar = new Direccion(req.body);
        //Guardar el creador via JWT
        direccionlugar.creador = req.lugar.id;
        direccionlugar.user = req.params.id;
        await direccionlugar.save();
        res.json({ ok: true, direccionlugar, msg: "se guardo la ubicación correctamente" });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }


}

//Obtiene todos los direccion del usuario 
exports.obtenerLocalizacion = async(req, res) => {
        try {
            const direccion = await Direccion.find({ creador: req.lugar.id });
            res.status(200).json({ direccion });
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error');
        }
    }
    //Obtiene direccion del usuario para la pagina principal
exports.obtenerDireccionPagina = async(req, res) => {

    try {
        const direccion = await Direccion.find({ creador: req.params.id });
        res.status(200).json({ direccion });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Atualiza un producto
exports.actualizarDireccion = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { direccion, latitude, longitude } = req.body;
    const nuevaDireccion = {};
    if (latitude, longitude, direccion) {
        nuevaDireccion.longitude = longitude;
        nuevaDireccion.latitude = latitude;
        nuevaDireccion.direccion = direccion;
    }

    try {

        //revisar el ID
        let direccion = await Direccion.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!direccion) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (direccion.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ACTUALIZAR
        direccion = await Direccion.findByIdAndUpdate({ _id: req.params.id }, {
            $set: nuevaDireccion
        }, { new: true });

        res.status(200).json({ ok: true, direccion });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Eliminar un producto

exports.eliminarDireccion = async(req, res) => {
    try {

        //revisar el ID
        let direccion = await Direccion.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!direccion) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (direccion.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ELIMINAR EL PROYECTO
        await Direccion.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Producto Eliminado" });




    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Obtiene todas lar rutas de los lugares

exports.obtenerTodosLosLugares = async(req, res = response) => {

    const direcciones = await Direccion.find({}).populate({
        path: 'creador',
        nodel: "Direccion",
    });

    const registro = [];

    for (i in direcciones)
        registro.push(direcciones[i]._id)

    console.log(registro)
        /* console.log(Object.keys(direcciones)) */
        //console.log(direcciones[0])
    try {

        res.json({ ok: true, direcciones });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}