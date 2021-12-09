const mongoose = require('mongoose');

const NodeSchema = new mongoose.Schema({
    _userId: {
        type: mongoose.Types.ObjectId,
        required: true
    },
    address: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    type: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    activeornot: {
        type: Boolean,
        required: true,
        minlength: 1,
        trim: true
    },
    batterylevel: {
        type: Number,
    },
    electrovan: {
        type: Boolean,
        required: true,
        minlength: 1,
        trim: true
    },
    mode: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    }

})

const Node = mongoose.model('Node', NodeSchema);

module.exports = { Node }