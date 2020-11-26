const mongoose = require('mongoose');

// Category Schema
var CategorySchema = mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    slug: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }

});
module.exports = mongoose.model('Category', CategorySchema);