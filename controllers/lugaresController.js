const Lugar = require('../models/lugar');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary-upload-image');
const jwt = require('jsonwebtoken');


exports.crearLugar = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //extraer email y password
    const { email, password } = req.body;

    try {
        let lugar = await Lugar.findOne({ email });

        if (lugar) {
            return res.status(400).json({ ok: false, msg: 'El usuario ya existe' });
        }

        //crear nuevo lugar
        lugar = new Lugar(req.body);

        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        lugar.password = await bcryptjs.hash(password, salt);

        //guardar lugar
        await lugar.save();

        //Crear y firmar el JWT
        const payload = {
            lugar: {
                id: lugar.id
            }
        }

        //firmar el token
        jwt.sign(payload, process.env.JWT_KEY, {
                expiresIn: '24h'
            }, (error, token) => {
                if (error) throw error;

                //Mensaje de confirmación
                res.status(200).json({ ok: true, token });
            })
            //const token = await generarJWT(lugar.id);




    } catch (error) {
        console.log(error);
        res.status(400).json({
            ok: false,
            msg: 'Hubo un error'
        });
    }
}


//Obtiene todos los datos del usuario actual
exports.obtenerDatos = async(req, res) => {

    try {

        //revisar el ID
        let lugarData = await Lugar.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!lugarData) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        res.json({ lugarData });



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