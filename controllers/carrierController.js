const Invoice = require('../models/carrier');

// Get All Carriers
exports.getAllCarriers = async (req, res) => {
    try {
        const carriers = await Invoice.find();
        res.status(200).json(carriers);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching carriers', error: error });
    }
};

// Get Carrier by ID
exports.getCarrierById = async (req, res) => {
    try {
        const carrier = await Invoice.findById(req.params.id);
        if (!carrier) {
            return res.status(404).json({ message: 'Carrier not found' });
        }
        res.status(200).json(carrier);
    } catch (error) {
        res.status(400).json({ message: 'Invalid ID for carrier', error: error });
    }
};

// Create New Carrier
exports.createCarrier = async (req, res) => {
    const { name, contact, phone, email, address } = req.body;

    if (!name || !contact) {
        return res.status(400).json({ message: 'Name and contact are required' });
    }

    try {
        const newCarrier = new Invoice({
            name,
            contact,
            phone,
            email,
            address
        });
        const savedCarrier = await newCarrier.save();
        res.status(201).json({ message: 'Carrier created successfully', carrier: savedCarrier._id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating carrier', error: error.message });
    }
};

// Update Carrier by ID
exports.updateCarrier = async (req, res) => {
    const { name, contact, phone, email, address } = req.body;

    if (!name || !contact) {
        return res.status(400).json({ message: 'Name and contact are required' });
    }

    try {
        const updatedCarrier = await Invoice.findByIdAndUpdate(
            req.params.id,
            { name, contact, phone, email, address },
            { new: true }
        );

        if (!updatedCarrier) {
            return res.status(404).json({ message: 'Carrier not found' });
        }

        res.status(200).json({ message: 'Carrier updated successfully', carrier: updatedCarrier });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating carrier', error: error.message });
    }
};

// Delete Carrier by ID
exports.deleteCarrier = async (req, res) => {
    try {
        const deletedCarrier = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedCarrier) {
            return res.status(404).json({ message: 'Carrier not found' });
        }
        res.status(200).json({ message: 'Carrier deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting carrier', error: error.message });
    }
};

