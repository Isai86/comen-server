const Promocion = require('../models/promocion');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary-upload-image');


/* exports.crearPromocion = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //extraer email y password
    const { titulo, descripcion, precio } = req.body;

    try {
        //Crear un producto 
        promocion = new Promocion(req.body);

        //Guardar el creador via JWT
        promocion.creador = req.lugar.id;


        //Se guarda el productov
        promocion.save();
        res.status(200).json({ ok: true, promocion })

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }


} */
exports.crearPromocion = async(req, res) => {


    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    try {
        const { titulo, descripcion, precio } = req.body;


        if (!titulo || !descripcion || !precio) {
            res.status(500).json({ ok: false, msg: 'Titulo, descripción y precio son obligatorios' })
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })
        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "promocion" }, async(err, result) => {
            if (err) throw err;

            //Crear un producto 
            const promocion = new Promocion({
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                avatar: result.secure_url
            });

            //Guardar el creador via JWT
            promocion.creador = req.lugar.id;


            //Se guarda el productov
            await promocion.save();
            res.status(200).json({ ok: true, promocion })
        })




    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }


}

//Obtiene todos los productos del usuario actual
exports.obtenerPromociones = async(req, res) => {
        try {
            const promocion = await Promocion.find({ creador: req.lugar.id });
            res.json({ promocion });
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error');
        }
    }
    //Obtiene productos del usuario para la pagina principal
exports.obtenerPromocionesPagina = async(req, res) => {

    try {
        const promocion = await Promocion.find({ creador: req.params.id });
        res.json({ promocion });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Atualiza un producto
exports.actualizarPromocion = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { titulo, descripcion, precio, avatar } = req.body;
    const nuevaPromocion = {};
    if (precio, descripcion, titulo, avatar) {
        nuevaPromocion.titulo = titulo;
        nuevaPromocion.descripcion = descripcion;
        nuevaPromocion.precio = precio;
        nuevaPromocion.avatar = avatar;
    }

    try {

        //revisar el ID
        let promocion = await Promocion.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!promocion) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (promocion.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ACTUALIZAR
        promocion = await Promocion.findByIdAndUpdate({ _id: req.params.id }, {
            $set: nuevaPromocion
        }, { new: true });

        res.json({ promocion });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Eliminar un producto

exports.eliminarPromocion = async(req, res) => {
    try {

        //revisar el ID
        let promocion = await Promocion.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!promocion) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (promocion.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ELIMINAR EL PROYECTO
        await Promocion.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Producto Eliminado" });




    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

exports.uploadAvatarPromo = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }


    try {

        //revisar el ID
        let promocion = await Promocion.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!promocion) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (promocion.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })

        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "promocion" }, async(err, result) => {
            if (err) throw err;
            promocion.avatar = result.secure_url;

            Promocion.findByIdAndUpdate({ _id: req.params.id }, promocion, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error del servidor." })
                } else {
                    res.status(200).json({ avatar: result.secure_url });
                }
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}