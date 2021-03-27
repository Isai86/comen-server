const { Schema, model } = require('mongoose');



const SubProductosSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
    },
    precio: {
        type: String,
        /* Number */
    },
    imagen: {
        type: String,
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos'
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Lugar'
    },
    avatar: {
        type: String,
    },
    creado: {
        type: Date,
        default: Date.now()
    },

});

module.exports = model('SubProductos', SubProductosSchema);