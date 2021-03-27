const { Schema, model } = require('mongoose');



const TipoRestoSchema = Schema({
    nombre: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    descripcion: {
        type: String,
    }

});

TipoRestoSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
})

module.exports = model('restaurant', TipoRestoSchema);