const Lugar = require('../models/lugar');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const { validationResult } = require('express-validator');
//const { generarJWT } = require('../helpers/jwt');
const jwt = require('jsonwebtoken');

exports.autenticar = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array(), msg: 'Todos los campos son obligatorios' })
    }

    //extraer el email y el password
    const { email, password } = req.body;

    try {
        //Revisar que el usuario este registrado
        let lugar = await Lugar.findOne({ email })
        if (!lugar) {
            return res.status(400).json({ ok: false, msg: 'Usuario o contraseñas incorrectos' });
        }

        //revisar el password
        const passCorrecto = await bcryptjs.compare(password, lugar.password);
        if (!passCorrecto) {
            return res.status(400).json({ ok: false, msg: 'Usuario o contraseñas incorrectos' })
        }

        //revisar si el usuario se encuentra activo
        if (lugar.active != true) {
            return res.status(400).json({ ok: false, msg: 'El usuario aún no se activo, por favor revisa tu email para confirmar tu cuenta.' })
        }


        //Si todo es correcto crear y firmar el jsonwebtoken
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
            res.status(200).json({ ok: true, token, lugar });
        })


    } catch (error) {
        console.log(error);
    }
}

exports.autenticarUser = async(req, res) => {

    //revisar si hay errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array(), msg: 'Todos los campos son obligatorios' })
    }

    //extraer el email y el password
    const { email, password } = req.body;

    try {
        //Revisar que el usuario este registrado
        let user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ ok: false, msg: 'Usuario o contraseñas incorrectos' });
        }

        //revisar el password
        const passCorrecto = await bcryptjs.compare(password, user.password);
        if (!passCorrecto) {
            return res.status(400).json({ ok: false, msg: 'Usuario o contraseñas incorrectos' })
        }

        //revisar si el usuario se encuentra activo
        if (user.active != true) {
            return res.status(400).json({ ok: false, msg: 'El usuario aún no se activo, por favor revisa tu email para confirmar tu cuenta.' })
        }


        //Si todo es correcto crear y firmar el jsonwebtoken
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
            if (error) throw error;

            //Mensaje de confirmación
            res.status(200).json({ ok: true, token, user });
        })


    } catch (error) {
        console.log(error);
    }
}