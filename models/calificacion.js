const { Schema, model } = require('mongoose');



const CalificacionSchema = Schema({

    calificacion: {
        type: Number,
        default: 5
    },
    comentario: {
        type: String,
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

module.exports = model('Calificacion', CalificacionSchema);