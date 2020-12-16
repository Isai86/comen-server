const Lugar = require('../models/lugar');
const { generarJWT } = require('../helpers/jwt');


exports.renewToken = async(req, res = response) => {

    const uid = req.uid;

    // generar un nuevo JWT, generarJWT... uid...
    const token = await generarJWT(uid);

    // Obtener el usuario por el UID, Usuario.findById... 
    const lugar = await Lugar.findById(uid);

    res.json({
        ok: true,
        lugar,
        token
    });

}