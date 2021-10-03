const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    date: { type: String },
    hash: { type: String },
    blockNumber: { type: Number },
    blockHash: { type: String },
    transactionIndex: { type: Number },
    from: { type: String },
    to: { type: String },
    value: { type: String },
    fee: { type: Number },
});

module.exports = mongoose.model('Transaction', transactionSchema);