const mongoose = require('mongoose');

const blockSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    number: { type: Number },
    hash: { type: String },
    timestamp: { type: Number }
});

module.exports = mongoose.model('Block', blockSchema);