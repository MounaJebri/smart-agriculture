const mongoose = require('mongoose');

const TanknodeSchema = new mongoose.Schema({
    _nodeId: {
        type: String
    },
    electrovan: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    waterlevel: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    time: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    }

})

const Tanknode = mongoose.model('Tanknode', TanknodeSchema);

module.exports = { Tanknode }