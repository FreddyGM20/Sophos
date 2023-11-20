const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');

router.post('/', rentalController.createRental);
router.get('/', rentalController.getAllRentals);
// Nueva ruta para obtener todos los alquileres y generar prueba de compra
router.get('/generateReceipt', rentalController.getAllRentalsAndGenerateReceipt);
// Nueva ruta para obtener un alquiler y generar prueba de compra
router.get('/generateReceipt/:rentalId', rentalController.generateReceiptForRental);
// Nueva ruta para obtener las ventas del día
router.get('/dailySales', rentalController.getDailySales);
// Nueva ruta para que los clientes consulten su balance, fecha de entrega y títulos alquilados
router.get('/customerRentals/:customerId', rentalController.getCustomerRentalsInfo);

module.exports = router;
