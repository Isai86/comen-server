const { Schema, model } = require('mongoose');

const LugarSchema = Schema({
    nombre: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    logo: {
        type: String,
        trim: true
    },
    abierto: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    descripcion: {
        type: String,
        trim: true
    },
    calificacion: {
        type: String,
    },
    delivery: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        trim: true
    },
    tipo: {
        type: String,
    },
    website: {
        type: String,
        trim: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    role: {
        type: String,
        default: "Lugar"
    },
    lugarname: {
        type: String,
        required: true,
        unique: true
    },
});

LugarSchema.method('toJSON', function() {
    const { __v, _id, password, createAt, ...object } = this.toObject();
    object.uid = _id;
    return object;
})



module.exports = model('Lugar', LugarSchema);