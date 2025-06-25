const express = require('express');
const router = express.Router();
const yatrikController = require('../controllers/yatrikController');

// Create a new Yatrik
router.post('/', yatrikController.createYatrik);

// Get all Yatrik records
router.get('/getallyatrik', yatrikController.getAllYatriks);

// Get a single Yatrik by ID
router.get('/getyatrik/:id', yatrikController.getYatrikById);

// Update a Yatrik by ID
router.put('/updateyatrik/:id', yatrikController.updateYatrik);

// Delete a Yatrik by ID
router.delete('/deleteyatrik/:id', yatrikController.deleteYatrik);

module.exports = router; 