const mongoose = require('mongoose');

const GatewaynodeSchema = new mongoose.Schema({
    _nodeId: {
        type: String
    },
    ordders: {
        type: Number,
        required: true,
        minlength: 1,
        trim: true
    },
    address: {
        type: String,
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

const Gatewaynode = mongoose.model('Gatewaynode', GatewaynodeSchema);

module.exports = { Gatewaynode }