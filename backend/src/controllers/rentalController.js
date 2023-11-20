const Rental = require('../models/Rental');
const Customer = require('../models/Customer');
const Game = require('../models/Game');
const { Op } = require('sequelize');

exports.createRental = async (req, res) => {
  const { customerId, gameId } = req.body;

  try {
    // Obtén la información del cliente
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Realizamos un nuevo alquiler
    const rental = await Rental.create({
      customerId,
      gameId,
      customerAge: customer.age, // Utiliza la edad del cliente
      customerName: customer.name,
      customerIdentity: customer.identity,
      dueDate: calculateDueDate(), // Agrega la fecha de vencimiento del alquiler
    });

    // Actualizamos el contador de alquileres del juego
    const game = await Game.findByPk(gameId);
    if (game) {
      game.rentalsCount += 1;

      // Actualizamos la columna leastRentedAgeGroup si es necesario
      if (!game.leastRentedAgeGroup || game.rentalsCount < game.leastRentedAgeGroupRentals) {
        game.leastRentedAgeGroup = customer.age;
        game.leastRentedAgeGroupRentals = game.rentalsCount;
      }

      await game.save();
    }

    // Actualizamos el contador de alquileres del cliente y almacenamos la información básica
    customer.rentalsCount += 1;
    customer.lastRentalDueDate = calculateDueDate(); // Agrega la fecha de vencimiento del último alquiler
    await customer.save();

    res.status(201).json(rental);
  } catch (error) {
    console.error('Error al crear alquiler:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función auxiliar para calcular la fecha de vencimiento (ejemplo, 7 días a partir de la fecha actual)
function calculateDueDate() {
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 7); // Puedes ajustar el número de días según tus necesidades
  return dueDate;
}


exports.getAllRentals = async (req, res) => {
  try {
    const rentals = await Rental.findAll();
    res.json(rentals);
  } catch (error) {
    console.error('Error al obtener alquileres:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Nueva función para obtener todos los alquileres y generar prueba de compra
exports.getAllRentalsAndGenerateReceipt = async (req, res) => {
  try {
    // Obtenemos todos los alquileres
    const rentals = await Rental.findAll({
      include: [Customer, Game],
    });

    if (!rentals || rentals.length === 0) {
      return res.status(404).json({ error: 'No hay alquileres disponibles' });
    }

    // Generamos la prueba de compra
    const receipts = rentals.map(rental => ({
      rentalId: rental.id,
      customer: {
        name: rental.Customer.name,
        identity: rental.Customer.identity,
      },
      game: {
        name: rental.Game.name,
        rentalPrice: rental.Game.rentalPrice, // Puedes incluir más detalles del juego según sea necesario
      },
      rentalDate: rental.createdAt,
      dueDate: rental.dueDate,
    }));

    res.json(receipts);
  } catch (error) {
    console.error('Error al obtener alquileres y generar prueba de compra:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Función para generar un recibo de compra para un ID de alquiler específico
exports.generateReceiptForRental = async (req, res) => {
  const { rentalId } = req.params; // Obtén el rentalId de los parámetros de la solicitud

  try {
    // Busca el alquiler por ID con los datos del cliente y el juego asociados
    const rental = await Rental.findByPk(rentalId, {
      include: [Customer, Game],
    });

    if (!rental) {
      return res.status(404).json({ error: 'Alquiler no encontrado' });
    }

    // Genera el recibo de compra para el alquiler específico
    const receipt = {
      rentalId: rental.id,
      customer: {
        name: rental.Customer.name,
        identity: rental.Customer.identity,
      },
      game: {
        name: rental.Game.name,
        rentalPrice: rental.Game.rentalPrice, // Puedes incluir más detalles del juego según sea necesario
      },
      rentalDate: rental.createdAt,
      dueDate: rental.dueDate,
    };

    res.json(receipt);
  } catch (error) {
    console.error('Error al generar recibo de compra para alquiler específico:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



// Nueva función para obtener las ventas del día
exports.getDailySales = async (req, res) => {
  try {
    // Obtenemos las transacciones (alquileres) del día actual
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dailySales = await Rental.findAll({
      where: {
        rentalDate: {
          [Op.gte]: today,
        },
      },
      include: [Customer, Game],
    });

    if (!dailySales || dailySales.length === 0) {
      return res.status(404).json({ error: 'No hay ventas disponibles para hoy' });
    }

    res.json(dailySales);
  } catch (error) {
    console.error('Error al obtener ventas del día:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Nueva función para que los clientes consulten su balance, fecha de entrega y títulos alquilados
exports.getCustomerRentalsInfo = async (req, res) => {
  const customerId = req.params.customerId; // Asumiendo que el customerId se pasa como parámetro en la URL

  try {
    // Buscamos al cliente
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }

    // Obtenemos la información de alquiler del cliente
    const customerRentals = await Rental.findAll({
      where: { customerId },
      include: [Game],
    });

    // Construimos la respuesta con la información requerida
    const customerRentalsInfo = customerRentals.map(rental => ({
      title: rental.Game.name,
      rentalDate: rental.createdAt,
      dueDate: rental.dueDate,
      balance: rental.balance,
    }));

    res.json(customerRentalsInfo);
  } catch (error) {
    console.error('Error al obtener información de alquiler del cliente:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};