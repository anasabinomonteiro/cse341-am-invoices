const mongoose = require('mongoose');

const carrierSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    contact: { type: String, required: true },
    phone: { type: String},
    email: { type: String},
    address: { type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model('Carrier', carrierSchema);