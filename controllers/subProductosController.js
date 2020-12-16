const SubProductos = require('../models/subProductos');
const Productos = require('../models/productos');
const { validationResult } = require('express-validator');
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

        //Creamos el Producto
        const subProducto = new SubProductos(req.body);
        await subProducto.save();
        res.json({ subProducto });


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

//Actualizar SubProducto
exports.actualizarsp = async(req, res) => {
    try {
        //Extraer el producto y comproaR si existe

        const { producto, nombre, descripcion, precio } = req.body;

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

        const { producto } = req.body;

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



        //Eliminar un subProducto
        await SubProductos.findOneAndRemove({ _id: req.params.id });
        res.json({ msg: "Producto Eliminado" });



    } catch (error) {
        console.log(error)
        res.status(500).send('Hubo un error');

    }

}