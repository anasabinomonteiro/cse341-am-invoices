const Invoice = require('../models/invoice');

// Get All Invoices
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching invoices', error: err });
    }
};

// Get Invoice by ID
exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json(invoice);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID for invoice', error: err });
    }
};

// Create New Invoice
exports.createInvoice = async (req, res) => {
    const { invoice, date, client, carrier, destination, status, amount } = req.body;

    if (!invoice || !date || !client || !carrier || !destination || !status || amount == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newInvoice = new Invoice({
            invoice,
            date,
            client,
            carrier,
            destination,
            status,
            amount
        });
        const savedInvoice = await newInvoice.save();
        res.status(201).json({ message: 'Invoice created successfully', invoice: savedInvoice._id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating invoice', error: err.message });
    }
};

// Update Invoice by ID
exports.updateInvoice = async (req, res) => {
    const { invoice, date, client, carrier, destination, status, amount } = req.body;

    if (!invoice || !date || !client || !carrier || !destination || !status || amount == null) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { invoice, date, client, carrier, destination, status, amount },
            { new: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }
        res.status(200).json({ message: 'Invoice updated successfully', invoice: updatedInvoice });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating invoice', error: err.message });
    }
};

// Delete Invoice by ID
exports.deleteInvoice = async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) {
            return res.status(404).json({ message: 'Invoice not found' });
        }

        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting invoice', error: err });
    }
};