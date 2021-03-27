const { Schema, model } = require('mongoose');



const ProductosSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Lugar'
    },
    creado: {
        type: Date,
        default: Date.now()
    }

});

module.exports = model('Productos', ProductosSchema);