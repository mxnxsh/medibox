const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    number: {
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    }

});

module.exports = mongoose.model('User', UserSchema);