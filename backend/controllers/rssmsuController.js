const RSSMsu = require('../models/RSSMsu');

// Create a new registration
exports.createRegistration = async (req, res) => {
  try {
    const registration = new RSSMsu(req.body);
    await registration.save();
    res.status(201).json(registration);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all registrations
exports.getAllRegistrations = async (req, res) => {
  try {
    const registrations = await RSSMsu.find().sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get registration by ID
exports.getRegistrationById = async (req, res) => {
  try {
    const registration = await RSSMsu.findById(req.params.id);
    if (!registration) return res.status(404).json({ error: 'Not found' });
    res.json(registration);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 