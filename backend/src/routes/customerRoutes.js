const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
// Nueva ruta para obtener al cliente más frecuente
router.get('/mostFrequent', customerController.getMostFrequentCustomer);

module.exports = router;
