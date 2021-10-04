const mongoose = require('mongoose');

const clientSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String },
    isActive: { type: Boolean, default: false },
    mainnet: { type: String },
    testnet: { type: String },
    rpcUser: { type: String },
    rpcPassword: { type: String }
});

module.exports = mongoose.model('Client', clientSchema);