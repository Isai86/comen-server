const Like = require('../models/like');
const User = require('../models/user');
const Lugar = require('../models/lugar');

exports.DarLike = async(req, res) => {

    try {


        const { lugar, active } = req.body;

        //Creamos el Producto
        const like = new Like(req.body);
        like.user = req.params.id;
        await like.save();
        res.json({ ok: true, like, msg: "Este lugar se agrego a tus me gusta" });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }


}





//Obtiene todos los lugares que sigue el usuario
exports.obtenerlikesUser = async(req, res) => {

    try {

        let user = await User.findById(req.params.id);


        //Obtener los subproductos por producto
        const likes = await Like.find({ user });
        res.status(200).json({ likes });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}

//Obtiene todos los likes del establecimiento
exports.obtenerlikesLugar = async(req, res) => {

    try {

        let lugar = await Lugar.findById(req.params.id);


        //Obtener los subproductos por producto
        const likes = await Like.find({ lugar });
        res.json({ likes, msg: "Un usuario comenzó a seguirte" });

    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}

exports.obtenerspPage = async(req, res) => {

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
/* exports.actualizarLike = async(req, res) => {
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

exports.eliminarLike = async(req, res) => {
    try {
        //Extraer el user y comprobar si existe


        //Revisar si el subproducto existe o no
        const like = await Like.findById(req.params.id);

        if (!like) {
            return res.status(401).json({ msg: "No existe ese Producto" });
        }


        //Eliminar un subProducto
        await Like.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Este lugar se elimino de tus me gusta" });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}

//Mostrar el like del usuario

exports.mostrarLike = async(req, res) => {
    try {



        //Se muestra el like 
        const like = await Like.find({ _id: req.params.id });
        res.json({ ok: true, like });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}