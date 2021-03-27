const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary-upload-image');
const jwt = require('jsonwebtoken');
const { transporter } = require('../utils/mailer');
const JSONTransport = require('nodemailer/lib/json-transport');


exports.crearUsuario = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array(), msg: 'Todos los campos son obligatorios' })
    }

    //extraer email y password
    const { email, password } = req.body;
    /* 
        if (!email || !password || !name) {
            return res.status(400).json({ ok: false, msg: 'Todos los campos son obligatorios' })
        } */
    if (password.length < 6) {
        return res.status(400).json({ ok: false, msg: 'La contraseña debe de tener un mínimo de 6 caracteres.' });
    }

    try {
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ ok: false, msg: 'El usuario ya existe' });
        }

        //crear nuevo user
        user = new User(req.body);


        //Hashear el password
        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        //guardar user
        await user.save();

        //Crear y firmar el JWT
        const payload = {
            user: {
                id: user.id
            }
        }



        //firmar el token
        jwt.sign(payload, process.env.JWT_KEY, {
                expiresIn: '24h'
            }, (error, token) => {
                let mail = {
                    from: '"Activar Cuenta" <noreply@laguiadelcomensal.com>', // sender address
                    to: user.email, // list of receivers
                    subject: "Activar Cuenta",
                    html: `<h2 style="font-family: 'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif; 
                    color: #f06e10;">Confirme su correo electrónico.</h2>
                    <p>Hola: <strong>${user.email}</strong>,</p>
                    <br>
                    <p>Gracias por registrarse en La guia del comensal, haga clic en el siguiente enlace para confirmar su dirección de correo electrónico.</p>
                    <p><a href="http://localhost:3000/ActivarCuenta/${token}">Click aquí para activar su cuenta.</a></p>
                    <p>El equipo de cuentas de comensal</p>
                    ` // html body
                };

                if (error) throw error;

                //Mensaje de confirmación
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
        let userData = await User.findById(req.params.id);
        const fecha = new Date();
        res.locals.year = fecha.getFullYear();


        //SI EL PROYECTO EXISTE O NO
        if (!userData) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        res.json({ userData });



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
        let usuario = await User.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!usuario) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })

        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "avatarUsuario" }, async(err, result) => {
            if (err) throw err;
            usuario.avatar = result.secure_url;

            User.findByIdAndUpdate({ _id: req.params.id }, usuario, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error del servidor." })
                } else {
                    res.status(200).json({ avatar: result.secure_url });
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
exports.actualizarUsuario = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { name, avatar, active } = req.body;
    const newUser = {};
    if (name, avatar, active) {
        newUser.name = name;
        newUser.avatar = avatar;
        newUser.active = active;
    }

    try {

        //revisar el ID
        let user = await User.findById(req.params.id);


        //SI EL USUARIO EXISTE O NO
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        //ACTUALIZAR
        user = await User.findByIdAndUpdate({ _id: req.params.id }, {
            $set: newUser
        }, { new: true });

        res.json({ user });



    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}

//Atualiza un producto
exports.verificarEmail = async(req, res) => {

    const usuario = await User.findOne({ email: req.body.email });

    if (!usuario) {
        return res.status(404).json({ msg: 'Usuario no encontrado' })
    }

    //Crear y firmar el JWT
    const payload = {
        usuario: {
            id: usuario.id
        }
    }


    //firmar el token
    jwt.sign(payload, process.env.JWT_KEY, {
        expiresIn: '24h'
    }, (error, token) => {
        if (error) throw error;

        let mail = {
            from: '"Cambiar contraseña" <noreply@laguiadelcomensal.com>', // sender address
            to: usuario.email, // list of receivers
            subject: "Cambiar contraseña",
            html: `<p>Hola: <strong>${usuario.name}</strong>,</p><br>
            <h1 style="font-family: 'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;
            font-size: 41px;
            color: #f06e10;">Cambiar contraseña</h1>
            <p>parece que solicitaste, cambiar tu contraseña, da clic en el siguiente enlace para continuar</p>  
             
             <p><a href="http://localhost:3000/resetpassword/${token}">Restablecer tu contraseña</a></p>
             <p>si no as sido tú as caso omiso de este correo.</p>
             <p>El equipo de cuentas de comensal</p>` // html body
        };

        transporter.sendMail(mail, function(err, info) {
            if (err) {
                console.log(err); // If error with sending e-mail, log to console/terminal
            } else {
                console.log(info);
                res.status(200).json({ ok: true, token }); // Log success message to console if sent
                console.log(lugar.email); // Display e-mail that it was sent to
                console.log('se envio correctamente')
            }
        });

        //Mensaje de confirmación
        res.status(200).json({ ok: true, token, msg: "Se envió un email a tu correo, en caso de que te encuentres registrado." });
    })
}

//Atualiza un producto
exports.reestablecerEmail = async(req, res) => {

    // Leer token
    const token = req.params.token;
    const { password } = req.body;
    const newUser = {};
    if (password) {
        const salt = await bcryptjs.genSalt(10);
        newUser.password = await bcryptjs.hash(password, salt);
    }



    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {


        const cifrado = jwt.verify(token, process.env.JWT_KEY);

        let user = await User.findById(cifrado.usuario.id);
        console.log(user)
        let mail = {
            from: '"Equipo de cuentas de comensal" <noreply@laguiadelcomensal.com>', // sender address
            to: user.email, // list of receivers
            subject: "Cambio de contraseña exitoso", /// plain text body
            html: `<p>Hola: <strong>${user.name}</strong>,</p><br>
            <h1 style="font-family: 'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;
            font-size: 41px;color: #f06e10;">Tu contraseña ha cambiado</h1>
            <p>La contraseña de la cuenta ${user.email} se cambió </p>
            <p>Si no has sido tú, la seguridad de tu cuenta está en peligro. Te recomendamos:</p>
            <p><a href="http://localhost:3000/resetpassword/${token}">1. Restablecer tu contraseña</a></p>
            <p>Gracias,</p> <p>El equipo de cuentas de comensal</p>` // html body
        };



        //SI EL USUARIO EXISTE O NO
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }



        //ACTUALIZAR
        user = await User.findByIdAndUpdate({ _id: cifrado.usuario.id }, {
            $set: newUser
        }, { new: true });


        transporter.sendMail(mail, function(err, info) {
            if (err) {
                console.log(err); // If error with sending e-mail, log to console/terminal
            } else {
                console.log(info);
                res.status(200).json({ ok: true, msg: 'Se cambio tu contraseña correctamente' }); // Log success message to console if sent
                console.log(lugar.email);
            }
        });


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}

exports.activarUsuario = async(req, res) => {

    // Leer token
    const { active } = req.body;
    const token = req.params.token;
    const newUser = {};
    if (active) {
        newUser.active = active;
    }

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {


        const cifrado = jwt.verify(token, process.env.JWT_KEY);

        let user = await User.findById(cifrado.user.id);

        console.log(user);

        let mail = {
            from: '"Equipo de cuentas de comensal" <noreply@laguiadelcomensal.com>', // sender address
            to: user.email, // list of receivers
            subject: "Cuenta activada", /// plain text body
            html: `<p>Hola: <strong>${user.email}</strong>,</p><br>
            <h1 style="font-family: 'Segoe UI Light','Segoe UI','Helvetica Neue Medium',Arial,sans-serif;
            font-size: 41px; color: #f06e10;">Cuenta activada</h1>
            <p>Tu cuenta se activo correctamente, ya puedes iniciar sesión.</p>
             <p>El equipo de cuentas de comensal</p>` // html body
        };



        //SI EL USUARIO EXISTE O NO
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }



        //ACTUALIZAR
        user = await User.findByIdAndUpdate({ _id: cifrado.user.id }, {
            $set: newUser
        }, { new: true });


        transporter.sendMail(mail, function(err, info) {
            if (err) {
                console.log(err); // If error with sending e-mail, log to console/terminal
            } else {
                console.log(info);
                res.status(200).json({ ok: true, msg: 'Usuario Activado, ya puedes iniciar Sesión.' }); // Log success message to console if sent
                console.log(lugar.email);
            }
        });


    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }

}