const { Schema, model } = require('mongoose');



const SocialSchema = Schema({
    titulo: {
        type: String,
        required: true,
        trim: true,
    },
    descripcion: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    avatar: {
        type: String,
    },
    creador: {
        type: Schema.Types.ObjectId,
        ref: 'Lugar'
    },

});

module.exports = model('Social', SocialSchema);