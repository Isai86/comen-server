const { Schema, model } = require('mongoose');



const PromoSchema = Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
    },

    descripcion: {
        type: String,
        required: true
    },

    precio: {
        type: String,
        /* Number */
    },
    active: {
        type: Boolean,
        default: false
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

module.exports = model('Promocion', PromoSchema);