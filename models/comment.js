const { Schema, model } = require('mongoose');



const ComentarioSchema = Schema({

    comentario: {
        type: String,
        required: true,
    },

    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    lugar: {
        type: Schema.Types.ObjectId,
        ref: 'Lugar'
    },
    creado: {
        type: Date,
        default: Date.now()
    }

});

module.exports = model('Comentario', ComentarioSchema);