const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');

router.post('/', gameController.createGame);
router.get('/', gameController.getAllGames);
// Nueva ruta para actualizar el precio del alquiler
router.put('/:gameId/rentalPrice', gameController.updateRentalPrice);
// Nueva ruta para obtener el juego más rentado
router.get('/mostRented', gameController.getMostRentedGame);
// Nueva ruta para consultar el listado de juegos por diferentes criterios
router.get('/getGamesByCriteria', gameController.getGamesByCriteria);
// Nueva ruta para obtener el juego menos rentado por rangos de edad
router.get('/leastRentedGameByAgeGroup', gameController.getLeastRentedGameByAgeGroup);
// Nueva ruta para eliminar un juego
router.delete('/:gameId', gameController.deleteGame);



module.exports = router;
