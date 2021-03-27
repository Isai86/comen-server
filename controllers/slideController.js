const Slide = require('../models/slide');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary-upload-image');


exports.crearSlide = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    try {
        const { titulo, descripcion } = req.body;


        if (!titulo || !descripcion) {
            res.status(500).json({ ok: false, msg: 'Titulo y descripción son obligatorios' })
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })
        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "slide" }, async(err, result) => {
            if (err) throw err;

            //Crear un producto 
            const slide = new Slide({
                titulo: req.body.titulo,
                descripcion: req.body.descripcion,
                avatar: result.secure_url
            });

            //Guardar el creador via JWT
            slide.creador = req.lugar.id;


            //Se guarda el producto
            await slide.save();
            res.status(200).json({ ok: true, slide });
        })




    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');
    }


}

//Obtiene todos los slides del usuario 
exports.obtenerSlides = async(req, res) => {
        try {
            const slide = await Slide.find({ creador: req.lugar.id });
            res.json({ slide });
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error');
        }
    }
    //Obtiene Slides del usuario para la pagina principal
exports.obtenerSlidesPagina = async(req, res) => {

    try {
        const slide = await Slide.find({ creador: req.params.id });
        res.json({ slide });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

//Atualiza un producto
exports.actualizarSlide = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { titulo, descripcion, avatar } = req.body;
    const nuevoSlide = {};
    if (titulo, descripcion, avatar) {
        nuevoSlide.titulo = titulo;
        nuevoSlide.descripcion = descripcion;
        nuevoSlide.avatar = avatar;
    }

    try {

        //revisar el ID
        let slide = await Slide.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!slide) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (slide.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ACTUALIZAR
        slide = await Slide.findByIdAndUpdate({ _id: req.params.id }, {
            $set: nuevoSlide
        }, { new: true });

        res.status(200).json({ ok: true, slide });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Eliminar un producto

exports.eliminarSlide = async(req, res) => {
    try {

        //revisar el ID
        let slide = await Slide.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!slide) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (slide.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        //ELIMINAR EL PROYECTO
        await Slide.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Producto Eliminado" });




    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

exports.uploadSlidePromo = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }


    try {

        //revisar el ID
        let slide = await Slide.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!slide) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (slide.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })

        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "slide" }, async(err, result) => {
            if (err) throw err;
            slide.avatar = result.secure_url;

            Slide.findByIdAndUpdate({ _id: req.params.id }, slide, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error del servidor." })
                } else {
                    res.status(200).json({ ok: true, avatar: result.secure_url });
                }
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

exports.uploadSlide = async(req, res) => {

    //Subir slide 
    try {


        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })

        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "slide" }, async(err, result) => {
            if (err) throw err;
            res.status(200).json({ ok: true, avatar: result.secure_url });
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}