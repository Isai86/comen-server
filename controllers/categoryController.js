const Category = require('../models/category');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary-upload-image');
const jwt = require('jsonwebtoken');


exports.crearCategoria = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }


    try {
        //crear nueva categoria
        categoria = new Category(req.body);

        //guardar categoria
        await categoria.save();

        res.status(200).json({ ok: true, categoria });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hubo un error'
        });
    }
}


//Obtiene todas las categorias
exports.obtenerCategorias = async(req, res) => {

    try {

        //revisar el ID
        let categorias = await Category.find();


        //SI EL PROYECTO EXISTE O NO
        if (!categorias) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        res.json({ categorias });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Actualizar logo
exports.uploadAvatar = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }


    try {

        //revisar el ID
        let lugar = await Lugar.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!lugar) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })

        const logo = req.files.logo;
        if (logo.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (logo.mimetype !== 'image/jpeg' && logo.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(logo.tempFilePath, { folder: "avatar" }, async(err, result) => {
            if (err) throw err;
            lugar.logo = result.secure_url;

            Lugar.findByIdAndUpdate({ _id: req.params.id }, lugar, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error del servidor." })
                } else {
                    res.status(200).json({ logo: result.secure_url });
                }
            })


            //res.json({ avatar: result.secure_url })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}


//Atualiza un producto
exports.actualizarLugar = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { lugarname, descripcion, phone, website, tipo, delivery, logo } = req.body;
    const nuevoLugar = {};
    if (lugarname, descripcion, phone, website, tipo, delivery, logo) {
        nuevoLugar.lugarname = lugarname;
        nuevoLugar.descripcion = descripcion;
        nuevoLugar.phone = phone;
        nuevoLugar.website = website;
        nuevoLugar.tipo = tipo;
        nuevoLugar.delivery = delivery;
        nuevoLugar.logo = logo;
    }

    try {

        //revisar el ID
        let lugar = await Lugar.findById(req.params.id);


        //SI EL LUGAR EXISTE O NO
        if (!lugar) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        //ACTUALIZAR
        proyecto = await Lugar.findByIdAndUpdate({ _id: req.params.id }, {
            $set: nuevoLugar
        }, { new: true });

        res.json({ lugar });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}