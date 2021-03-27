const { Schema, model } = require('mongoose');

const UserSchema = Schema({
    name: {
        type: String,
        required: true,
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
    },
    avatar: {
        type: String,
        trim: true
    },
    createAt: {
        type: Date,
        default: Date.now()
    },
    active: {
        type: Boolean,
        default: false
    },

    role: {
        type: String,
        default: "User"
    },
});
UserSchema.method('toJSON', function() {
    const { __v, _id, password, createAt, ...object } = this.toObject();
    object.uid = _id;
    return object;
})

module.exports = model('User', UserSchema);