const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // Leer token
    const token = req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la petición'
        });
    }

    try {

        const cifrado = jwt.verify(token, process.env.JWT_KEY);
        req.user = cifrado.user;

        next();

    } catch (error) {
        return res.status(401).json({
            ok: false,
            msg: 'Token no válido'
        })
    }




}


module.exports = {
    validarJWT
}