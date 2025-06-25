const Yatrik = require('../models/7jatrayatrik-25');

// Create a new Yatrik record
exports.createYatrik = async (req, res) => {
    try {
        const newYatrik = new Yatrik({
            ...req.body,
            yatrikPhoto: req.body.yatrikPhoto // Ensure yatrikPhoto is included
        });
        await newYatrik.save();
        res.status(201).json(newYatrik);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Get all Yatrik records
exports.getAllYatriks = async (req, res) => {
    try {
        const yatriks = await Yatrik.find();
        res.status(200).json(yatriks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single Yatrik record by ID
exports.getYatrikById = async (req, res) => {
    try {
        const yatrik = await Yatrik.findById(req.params.id);
        if (!yatrik) return res.status(404).json({ message: 'Yatrik not found' });
        res.status(200).json(yatrik);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a Yatrik record by ID
exports.updateYatrik = async (req, res) => {
    try {
        const updatedYatrik = await Yatrik.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedYatrik) return res.status(404).json({ message: 'Yatrik not found' });
        res.status(200).json(updatedYatrik);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Delete a Yatrik record by ID
exports.deleteYatrik = async (req, res) => {
    try {
        const deletedYatrik = await Yatrik.findByIdAndDelete(req.params.id);
        if (!deletedYatrik) return res.status(404).json({ message: 'Yatrik not found' });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 