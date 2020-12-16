const { Schema, model } = require('mongoose');



const SlideSchema = Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    avatar: {
        type: String,
    },

    descripción: {
        type: String
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

module.exports = model('Slide', SlideSchema);