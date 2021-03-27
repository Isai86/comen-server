const { Schema, model } = require('mongoose');



const CategorySchema = Schema({

    avatar: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        required: true,
    },
    creado: {
        type: Date,
        default: Date.now()
    }

});

module.exports = model('Category', CategorySchema);