const SubProductos = require('../models/subProductos');
const Productos = require('../models/productos');
const { validationResult } = require('express-validator');
const { cloudinary } = require('../utils/cloudinary-upload-image');
//Crea un nuevo Producto
exports.crearunsp = async(req, res) => {

    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }


    try {

        //Extraer el producto y comprobar si existe

        const { producto } = req.body;

        const existeproducto = await Productos.findById(producto);
        if (!existeproducto) {
            res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //Revisar si el producto pertenece al usuario
        if (existeproducto.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })
        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "promocion" }, async(err, result) => {
            if (err) throw err;

            //Crear un producto 
            const subProducto = new SubProductos({
                nombre: req.body.nombre,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                producto: req.body.producto,
                avatar: result.secure_url
            });

            //Guardar el creador via JWT
            subProducto.creador = req.lugar.id;


            //Se guarda el producto
            await subProducto.save();
            res.status(200).json({ ok: true, subProducto })
        })



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }


}




//Obtiene los subProductos de cada producto
exports.obtenersp = async(req, res) => {

        try {
            //Extraer el producto y comprobar si existe

            const { producto } = req.body;

            const existeproducto = await Productos.findById(producto);
            if (!existeproducto) {
                res.status(404).json({ msg: 'Producto no encontrado' })
            }

            //Revisar si el producto pertenece al usuario
            if (existeproducto.creador.toString() !== req.lugar.id) {
                return res.status(401).json({ msg: "No autorizado" });
            }

            //Obtener los subproductos por producto
            const subProducto = await SubProductos.find({ producto });
            res.json({ subProducto });

        } catch (error) {
            console.log(error)
            res.status(500).send('Hubo un error');

        }
    }
    /* 
    exports.obtenerProductosPage = async(req, res) => {
        try {
            const productos = await Productos.find({ creador: req.params.id });
            res.json({ productos });
        } catch (error) {
            console.log(error);
            res.status(500).send('Hubo un error');
        }
    }
     */
    //Obtiene los subProductos de cada producto para el menu 
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

//Actualizar SubProducto
exports.actualizarsp = async(req, res) => {
    try {
        //Extraer el producto y comproar si existe

        const { producto, nombre, descripcion, precio, avatar } = req.body;

        //Revisar si el subproducto existe o no
        const subproducto = await SubProductos.findById(req.params.id);

        if (!subproducto) {
            return res.status(401).json({ msg: "No existe ese Producto" });
        }


        const existeproducto = await Productos.findById(producto);

        //Revisar si el producto pertenece al usuario
        if (existeproducto.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }



        //Crear un objeto con la nueva información
        const nuevoSubProducto = {};

        if (nombre) nuevoSubProducto.nombre = nombre;

        if (descripcion) nuevoSubProducto.descripcion = descripcion;

        if (precio) nuevoSubProducto.precio = precio;

        if (avatar) nuevoSubProducto.avatar = avatar;

        //Guardar el SubProducto
        subProducto = await SubProductos.findOneAndUpdate({ _id: req.params.id }, nuevoSubProducto, { new: true });

        res.json({ subProducto });


    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }
}


//Eliminar un subProducto
exports.eliminarsp = async(req, res) => {
    try {
        //Extraer el producto y comproaR si existe

        //const { producto } = req.body;

        //Revisar si el subproducto existe o no
        const subproducto = await SubProductos.findById(req.params.id);

        if (!subproducto) {
            return res.status(401).json({ msg: "No existe ese Producto" });
        }


        //const existeproducto = await Productos.findById(producto);

        //Revisar si el producto pertenece al usuario
        /* if (existeproducto.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        } */



        //Eliminar un subProducto
        await SubProductos.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Producto Eliminado" });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}

exports.uploadFotoSP = async(req, res) => {
    //Revisar si existen errores
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(404).json({ errores: errores.array() })
    }


    try {

        //revisar el ID
        let subProducto = await SubProductos.findById(req.params.id);


        //SI EL PROYECTO EXISTE O NO
        if (!subProducto) {
            return res.status(404).json({ msg: 'Producto no encontrado' })
        }

        //VERIFICAR EL CREADOR DEL PROYECTO
        if (subProducto.creador.toString() !== req.lugar.id) {
            return res.status(401).json({ msg: "No autorizado" });
        }

        console.log(req.files)
        if (!req.files || Object.keys(req.files).length === 0)
            return res.status(400).json({ msg: 'No hay ningun archivo para subir.' })

        const avatar = req.files.avatar;
        if (avatar.size > 1024 * 1024) return res.status(400).json({ msg: 'El archivo es muy grande' })

        if (avatar.mimetype !== 'image/jpeg' && avatar.mimetype !== 'image/png')
            return res.status(400).json({ msg: 'El tipo de formato de este archivo no es compatible(solo png o jpg)' })

        cloudinary.v2.uploader.upload(avatar.tempFilePath, { folder: "subproductos" }, async(err, result) => {
            if (err) throw err;
            subProducto.avatar = result.secure_url;

            SubProductos.findByIdAndUpdate({ _id: req.params.id }, subProducto, (err) => {
                if (err) {
                    res.status(500).json({ message: "Error del servidor." })
                } else {
                    res.status(200).json({ avatar: result.secure_url });
                }
            })
        })

    } catch (error) {
        console.log(error);
        res.status(500).send('Error en el servidor');
    }
}