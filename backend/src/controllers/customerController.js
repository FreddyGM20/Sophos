const Customer = require('../models/Customer');
const Rental = require('../models/Rental');

exports.createCustomer = async (req, res) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json(customer);
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Nueva función para obtener al cliente más frecuente
exports.getMostFrequentCustomer = async (req, res) => {
  try {
    // Encontramos al cliente con el mayor número de alquileres
    const mostFrequentCustomer = await Customer.findOne({
      order: [['rentalsCount', 'DESC']],
    });

    if (!mostFrequentCustomer) {
      return res.status(404).json({ error: 'No hay clientes disponibles' });
    }

    res.json(mostFrequentCustomer);
  } catch (error) {
    console.error('Error al obtener cliente más frecuente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
