const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    title: {
        type: String
    },
    slug: {
        type: String,
    },
    desc: {
        type: String
    },
    price: {
        type: String
    },
    dummyPrice: {
        type: String
    },
    quantity: {
        type: Number
    },
    category: {
        type: String,
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