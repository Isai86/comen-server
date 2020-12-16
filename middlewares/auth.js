const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    //Leer el token del header

    const token = req.header('x-auth-token');

    console.log(token);

    //Revisar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'Permiso no válido' })
    }


    //Validar el token

    try {
        const cifrado = jwt.verify(token, process.env.JWT_KEY);
        req.lugar = cifrado.lugar;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token no válido' })
    }
}