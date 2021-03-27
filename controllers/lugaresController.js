const Lugar = require('../models/lugar');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary-upload-image');
const jwt = require('jsonwebtoken');
const { transporter } = require('../utils/mailer');
const Direccion = require('../models/direccions');


exports.crearLugar = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //extraer email y password
    const { email, password, lugarname } = req.body;



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

        let mail = {
            from: '"Activar Cuenta" <noreply@laguiadelcomensal.com>', // sender address
            to: lugar.email, // list of receivers
            subject: "Activar Cuenta ✔", /// plain text body
            text: `Hola ${lugar.lugarname}, Gracias por registrarse en <strong>La guia del comensal</strong> Haga clic en el siguiente enlace para completar su activación:http://localhost:3000/ActivarCuenta/`,
            html: `<h2>Hola <strong style=" color:#f06e10; ">${lugar.lugarname}</strong>,</h2><br><br><h3 style="padding-bottom:50px;">Gracias por registrarse en La guia del comensal Haga clic en el siguiente enlace para completar su activación:</h3><br><br><a href="http://localhost:3000/ActivarCuenta">VERIFICAR CUENTA</a>` // html body
        };

        //firmar el token
        jwt.sign(payload, process.env.JWT_KEY, {
                expiresIn: '24h'
            }, (error, token) => {
                if (error) throw error;

                transporter.sendMail(mail, function(err, info) {
                    if (err) {
                        console.log(err); // If error with sending e-mail, log to console/terminal
                    } else {
                        console.log(info);
                        res.status(200).json({ ok: true, token, msg: 'Cuenta registrada! Por favor revise su correo electrónico para poder activar su cuenta. ' }); // Log success message to console if sent
                        console.log(lugar.email); // Display e-mail that it was sent to
                        console.log('se envio correctamente')
                    }
                });

                //Mensaje de confirmación

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
        const fecha = new Date();
        res.locals.year = fecha.getFullYear();


        //SI EL PROYECTO EXISTE O NO
        if (!lugarData) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        res.json({ lugarData, fecha });



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

        cloudinary.v2.uploader.upload(logo.tempFilePath, { folder: "logo" }, async(err, result) => {
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
    const { lugarname, descripcion, phone, website, tipo, delivery } = req.body;
    const nuevoLugar = {};
    if (lugarname, descripcion, phone, website, tipo, delivery) {
        nuevoLugar.lugarname = lugarname;
        nuevoLugar.descripcion = descripcion;
        nuevoLugar.phone = phone;
        nuevoLugar.website = website;
        nuevoLugar.tipo = tipo;
        nuevoLugar.delivery = delivery;
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

        res.status(200).json({ ok: true, lugar });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Atualiza un producto
exports.openCLoseLugar = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { abierto } = req.body;
    const nuevoLugar = {};
    if (abierto) {
        nuevoLugar.abierto = abierto;
    }

    try {

        //revisar el ID
        let lugar = await Lugar.findById(req.params.id);


        //SI EL LUGAR EXISTE O NO
        if (!lugar) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }


        if (abierto === "false") {
            //ACTUALIZAR
            proyecto = await Lugar.findByIdAndUpdate({ _id: req.params.id }, {


                $set: nuevoLugar
            }, { new: false });

            res.status(200).json({ ok: true, lugar, msg: 'Lugar cerrado' });
        } else if (abierto === "true") {

            proyecto = await Lugar.findByIdAndUpdate({ _id: req.params.id }, {


                $set: nuevoLugar
            }, { new: true });

            res.status(200).json({ ok: true, lugar, msg: 'Lugar abierto' });

        }




    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Obtiene todos los lugares por busqueda y verifica que el lugar se encuentre activo

exports.obtenerComidas = async(req, res = response) => {
    const query = req.query;
    const lugarData = await Lugar.find({ active: query.active, tipo: query.tipo });
    try {

        res.json({ ok: true, lugarData });
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}



exports.obtenerRapida = async(req, res = response) => {

    const query = req.query;
    const lugarData = await Lugar.find({ active: query.active, tipo: query.tipo });
    const { lat1, lon1 } = req.body;



    const registro = [];

    for (i in lugarData)
        registro.push(lugarData[i]._id)

    const direccion = await Direccion.find({ creador: registro }).populate({
        path: 'creador',
        nodel: "Direccion",
    });



    try {



        var cprueba = [];

        for (i in direccion) {
            rad = function(x) {
                return x * Math.PI / 180;
            }
            var Radio = 6378.137;
            var lat2 = direccion[i].latitude;
            var lon2 = direccion[i].longitude;
            var dLat1 = rad(lat2 - lat1);
            var dLong1 = rad(lon2 - lon1);
            var a1 = Math.sin(dLat1 / 2) * Math.sin(dLat1 / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong1 / 2) * Math.sin(dLong1 / 2);
            var c1 = 2 * Math.atan2(Math.sqrt(a1), Math.sqrt(1 - a1))
            var d1 = Radio * c1
            var e = d1.toFixed(3)

            var f = e < 2.000 ? direccion[i].creador._id : '';


            cprueba.push(f)
        }

        /* resp = cprueba.filter(cprueba => cprueba < 2.000); */



        const lugares = [];

        for (i in cprueba)
            lugares.push(cprueba[i]._id)





        const lugarData = await Lugar.find({ _id: lugares });
        try {

            res.json({ ok: true, lugarData });
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error');
        }



    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}