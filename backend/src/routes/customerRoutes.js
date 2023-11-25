const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

router.post('/', customerController.createCustomer);
router.get('/', customerController.getAllCustomers);
// Ruta para obtener la información de un cliente por ID
router.get('/customerid/:customerId', customerController.getCustomerById);
// Nueva ruta para obtener al cliente más frecuente
router.get('/mostFrequent', customerController.getMostFrequentCustomer);

module.exports = router;
