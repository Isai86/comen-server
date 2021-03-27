const Calificacion = require('../models/calificacion');
const User = require('../models/user');
const Lugar = require('../models/lugar');

exports.AgregarCalificacion = async(req, res) => {

    try {




        //Creamos el Producto
        const calificacion = new Calificacion(req.body);
        calificacion.user = req.params.id;
        await calificacion.save();
        res.json({ calificacion, msg: "Gracias por tu calificación" });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }


}





//Obtiene todos los comentarios del usuario
exports.obtenerCalificacion = async(req, res) => {

    try {

        let user = await User.findById(req.params.id);


        //Obtener los calificacion del usuario
        const calificacion = await Calificacion.find({ user }).populate({
            path: 'lugar',
            nodel: "Lugar",
        });



        res.json({ calificacion });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}

//Obtiene todos los comentarios del lugar
exports.obtenerCalificacionLugar = async(req, res) => {

    try {

        let lugar = await Lugar.findById(req.params.id);


        //Obtener los calificacion del usuario
        const calificacion = await Calificacion.find({ lugar }).populate({
            path: 'user',
            nodel: "User",
        });


        var suma = 0;
        for (var i = 0; i < calificacion.length; i++) {
            suma += calificacion[i].calificacion;
        }


        const resultado = calificacion.length < 10 ? Number.parseFloat(5.0) : suma / calificacion.length;
        /* 
                var perfecta = 5; */



        const nuevoLugar = {};
        if (resultado) {
            nuevoLugar.calificacion = resultado;
        }



        //SI EL LUGAR EXISTE O NO
        if (!lugar) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }

        //ACTUALIZAR
        proyecto = await Lugar.findByIdAndUpdate({ _id: req.params.id }, {
            $set: nuevoLugar
        }, { new: true });


        res.status(200).json({ calificacion });

    } catch (error) {
        console.log(error)
        res.status(500).json('Hubo un error');

    }
}



//Modificar calificación o comentario
exports.modificarCalificacion = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }

    //Extraer la información del proyecto
    const { calificacion, comentario } = req.body;
    const nuevoLugar = {};
    if (calificacion, comentario) {
        nuevoLugar.calificacion = calificacion;
        nuevoLugar.comentario = comentario;
    }

    try {

        //revisar el ID
        let user = await User.findById(req.body);


        //SI EL LUGAR EXISTE O NO
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' })
        }


        proyecto = await Calificacion.findByIdAndUpdate({ _id: req.params.id }, {


            $set: nuevoLugar
        }, { new: false });

        res.status(200).json({ ok: true, user, msg: 'Lugar cerrado' });






    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}



//Eliminar un producto

exports.eliminarCalificacion = async(req, res) => {
    try {
        //Extraer el user y comprobar si existe


        //Revisar si el subproducto existe o no
        const calificacion = await Calificacion.findById(req.params.id);

        if (!calificacion) {
            return res.status(401).json({ msg: "No existe ese Producto" });
        }


        //Eliminar un subProducto
        await Calificacion.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Eliminaste este calificacion" });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}