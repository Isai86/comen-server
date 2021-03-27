const { Schema, model } = require('mongoose');



const DireccionSchema = Schema({

    direccion: {
        type: String,
        /* required: true, */
        trim: true,
    },
    latitude: {
        type: String,
    },
    longitude: {
        type: String,
    },

    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Lugar'
    },

});

module.exports = model('Direccion', DireccionSchema);