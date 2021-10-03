const mongoose = require('mongoose');

const globalVariableSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    confirmationCount: { type: Number, default: 13 },
    autoMoving: { type: Boolean, default: false }
});

module.exports = mongoose.model('GlobalVariable', globalVariableSchema);