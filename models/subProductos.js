const { Schema, model } = require('mongoose');



const SubProductosSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
    },
    precio: {
        type: String,
        required: true,
    },
    imagen: {
        type: String,
    },
    producto: {
        type: Schema.Types.ObjectId,
        ref: 'Productos'
    },
    creado: {
        type: Date,
        default: Date.now()
    }

});

module.exports = model('SubProductos', SubProductosSchema);