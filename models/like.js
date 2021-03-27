const { Schema, model } = require('mongoose');



const LikeSchema = Schema({

    like: {
        type: Boolean,
        default: true,

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

module.exports = model('Like', LikeSchema);