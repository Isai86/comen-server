const { Schema, model } = require('mongoose');



const SlideSchema = Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    avatar: {
        type: String,
    },

    descripcion: {
        type: String
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Lugar'
    },

});

module.exports = model('Slide', SlideSchema);