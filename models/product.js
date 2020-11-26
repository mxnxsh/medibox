const mongoose = require('mongoose');

// Product Schema
const productSchema = mongoose.Schema({
    title: {
        type: String
    },
    slug: {
        type: String,
    },
    desc: {
        type: String
    },
    dummyPrice: {
        type: String
    },
    price: {
        type: String
    },
    quantity: {
        type: Number
    },
    avatar: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});
module.exports = mongoose.model('Product', productSchema);