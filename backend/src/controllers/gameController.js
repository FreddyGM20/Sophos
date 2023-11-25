const Game = require('../models/Game');
const Rental = require('../models/Rental');
const Customer = require('../models/Customer');
const { Op } = require('sequelize');

exports.createGame = async (req, res) => {
  try {
    const game = await Game.create(req.body);
    res.status(201).json(game);
  } catch (error) {
    console.error('Error al crear juego:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

exports.getAllGames = async (req, res) => {
  try {
    const games = await Game.findAll();
    res.json(games);
  } catch (error) {
    console.error('Error al obtener juegos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Controlador para buscar un juego por ID
exports.getGameById = async (req, res) => {
  const { gameId } = req.params;

  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    res.status(200).json(game);
  } catch (error) {
    console.error('Error al buscar juego por ID:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Nueva función para actualizar el precio del alquiler
exports.updateRentalPrice = async (req, res) => {
  const { gameId } = req.params;
  const { rentalPrice } = req.body;
  console.log(gameId, rentalPrice)

  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    // Actualizamos el precio del alquiler
    game.rentalPrice = rentalPrice;
    await game.save();

    res.json(game);
  } catch (error) {
    console.error('Error al actualizar precio del alquiler:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

  // Nueva función para realizar un alquiler y actualizar el contador
  exports.createRental = async (req, res) => {
    const { gameId, customerId } = req.body;
  
    try {
      // Realizamos un nuevo alquiler
      const rental = await Rental.create({ gameId, customerId });
  
      // Actualizamos el contador de alquileres del juego
      const game = await Game.findByPk(gameId);
      if (game) {
        game.rentalsCount += 1;
        await game.save();
      }
  
      res.status(201).json(rental);
    } catch (error) {
      console.error('Error al crear alquiler:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  // Nueva función para obtener el juego más rentado
  exports.getMostRentedGame = async (req, res) => {
    try {
      // Encontramos el juego con el mayor número de alquileres
      const mostRentedGame = await Game.findOne({
        order: [['rentalsCount', 'DESC']],
      });
  
      if (!mostRentedGame) {
        return res.status(404).json({ error: 'No hay juegos disponibles' });
      }
  
      res.json(mostRentedGame);
    } catch (error) {
      console.error('Error al obtener juego más rentado:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };

  // Nueva función para consultar el listado de juegos por diferentes criterios
  exports.getGamesByCriteria = async (req, res) => {
    try {
      const { criteria, value } = req.query;
      let games;
  
      switch (criteria) {
        case 'director':
          games = await Game.findAll({
            where: {
              director: {
                [Op.like]: `%${value}%`,
              },
            },
          });
          break;
        case 'protagonist':
          games = await Game.findAll({
            where: {
              protagonists: {
                [Op.like]: `%${value}%`,
              },
            },
          });
          break;
        case 'producer':
          games = await Game.findAll({
            where: {
              producer: {
                [Op.like]: `%${value}%`,
              },
            },
          });
          break;
        case 'year':
          games = await Game.findAll({
            where: { year: value },
          });
          break;
        default:
          return res.status(400).json({ error: 'Criterio no válido' });
      }
  
      if (!games || games.length === 0) {
        return res.status(201).json({ error: 'No se encontraron juegos con el criterio especificado' });
      }
  
      res.json(games);
    } catch (error) {
      console.error('Error al obtener juegos por criterio:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  
  exports.getLeastRentedGameByAgeGroup = async (req, res) => {
    try {
      // Obtener el rango de edad del cliente desde los parámetros de la solicitud
      const { minAge, maxAge } = req.query;
  
      // Verificar si los parámetros de edad están presentes
      if (!minAge || !maxAge) {
        return res.status(400).json({ error: 'Debes proporcionar los parámetros de edad (minAge y maxAge).' });
      }
  
      // Convertir las edades a números enteros
      const minAgeInt = parseInt(minAge, 10);
      const maxAgeInt = parseInt(maxAge, 10);
  
      // Calcular los límites del rango de edad en base a múltiplos de 10
      const minAgeLimit = Math.floor(minAgeInt / 10) * 10;
      const maxAgeLimit = Math.ceil(maxAgeInt / 10) * 10;
  
      // Realizar la consulta para obtener el juego menos rentado en el rango de edad
      const leastRentedGame = await Game.findOne({
        where: {
          leastRentedAgeGroup: {
            [Op.gte]: minAgeLimit,
            [Op.lte]: maxAgeLimit,
          },
        },
        order: [['rentalsCount', 'ASC']],
      });
  
      if (!leastRentedGame) {
        return res.status(201).json({ error: 'No hay juegos disponibles en el rango de edad especificado.' });
      }
  
      res.json(leastRentedGame);
    } catch (error) {
      console.error('Error al obtener el juego menos rentado por rango de edad:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
  

// Función para eliminar un juego por ID
exports.deleteGame = async (req, res) => {
  const { gameId } = req.params; // Obtén el gameId de los parámetros de la solicitud

  try {
    // Busca el juego por ID
    const game = await Game.findByPk(gameId);

    if (!game) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    // Elimina el juego
    await game.destroy();

    res.json({ message: 'Juego eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar juego:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};
