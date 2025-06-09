const express = require('express');
const router = express.Router();
const controller = require('../controllers/rssmsuController');

// Create a new registration
router.post('/', controller.createRegistration);

// Get all registrations
router.get('/', controller.getAllRegistrations);

// Get registration by ID
router.get('/:id', controller.getRegistrationById);

module.exports = router; 