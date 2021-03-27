const { Schema, model } = require('mongoose');



const PedidoSchema = Schema({

    productos: [{
        producto: {
            type: Schema.Types.ObjectId,
            ref: 'SubProductos'
        },
        cantidad: Number,
    }],
    promociones: [{
        promocion: {
            type: Schema.Types.ObjectId,
            ref: 'Promocion'
        },
        cantidad: Number,
    }],

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
    },

    total: {
        type: Number
    },
    especificacion: {
        type: String
    }

});

module.exports = model('Pedido', PedidoSchema);