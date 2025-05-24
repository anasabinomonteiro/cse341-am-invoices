const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
    invoice: { type: String, required: true, unique: true },
    date: { type: Date, required: true },
    client: { type: String, required: true },
    carrier: { type: String, required: true },
    destination: { type: String, required: true },
    status: { type: String, enum: ['Pending', 'In Transit', 'Delivered'], required: true, default: 'Pending' },
    amount: { type: Number, required: true }
});

// Hide the field "_v" from the response
invoiceSchema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model('Invoice', invoiceSchema);