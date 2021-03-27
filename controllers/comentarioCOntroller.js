const Comentario = require('../models/comment');
const User = require('../models/user');
const Lugar = require('../models/lugar');

exports.AgregarComentario = async(req, res) => {

    try {




        //Creamos el Producto
        const comentario = new Comentario(req.body);
        comentario.user = req.params.id;
        await comentario.save();
        res.json({ comentario, msg: "COmentario agregado correctamente" });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }


}





//Obtiene todos los comentarios del usuario
exports.obtenerComentariosUser = async(req, res) => {

    try {

        let user = await User.findById(req.params.id);


        //Obtener los comentarios del usuario
        const comentarios = await Comentario.find({ user });
        res.json({ comentarios });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}

//Obtiene todos los comentarios del establecimiento
exports.obtenerCOmentariosLugar = async(req, res) => {

    try {

        let lugar = await Lugar.findById(req.params.id);


        //Obtener los comentarios
        const comentarios = await Comentario.find({ lugar });
        res.json({ comentarios, msg: "Se agrego un nuevo comentario de tu lugar" });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}

/* exports.obtenerspPage = async(req, res) => {

    try {
        //Extraer el producto y comprobar si existe

        const { producto } = req.body;

        const existeproducto = await Productos.find({ producto: req.params.id });
        if (!existeproducto) {
            res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //Obtener los subproductos por producto
        const subProducto = await SubProductos.find({ producto });
        res.json({ subProducto });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}

//Habilitar/Deshabilitar like
exports.actualizarLike = async(req, res) => {
    try {
        //Extraer el user y comproar si existe



        //Revisar si el subproducto existe o no
        const like = await Like.findById(req.params.id);

        if (!like) {
            return res.status(401).json({ msg: "Error interno" });
        }

        //Crear un objeto con la nueva información
        const actualizarlike = {};

        if (like) actualizarlike.like = like;

        //Guardar el SubProducto
        like = await Like.findOneAndUpdate({ _id: req.params.id }, actualizarlike, { new: true });

        if (like === false) {
            res.json({ like, msg: "Este lugar se elimino de tus me gusta" })
        } else {
            res.json({ like, msg: "Este lugar se agrego a tus me gusta" })
        }

        res.json({ like });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
} */

//Eliminar un producto

exports.eliminarComentario = async(req, res) => {
    try {
        //Extraer el user y comprobar si existe


        //Revisar si el subproducto existe o no
        const comentario = await Comentario.findById(req.params.id);

        if (!comentario) {
            return res.status(401).json({ msg: "No existe ese Producto" });
        }


        //Eliminar un subProducto
        await Comentario.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Eliminaste este comentario" });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}