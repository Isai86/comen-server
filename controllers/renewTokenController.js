const Lugar = require('../models/lugar');
const User = require('../models/user');
const jwt = require('jsonwebtoken');


exports.renewToken = async(req, res = response) => {

    const uid = req.lugar.id;



    // Obtener el usuario por el UID, Lugar.findById... 
    const lugar = await Lugar.findById(uid);
    console.log(lugar);

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
    console.log(lugar)

}


exports.renewTokenUser = async(req, res = response) => {

    const uid = req.user.id;

    // Obtener el usuario por el UID, Usuario.findById... 
    const user = await User.findById(uid);
    console.log(user)

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


}