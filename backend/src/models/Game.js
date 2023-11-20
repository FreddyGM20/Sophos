const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Game = sequelize.define('Game', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rentalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  // Agregamos una columna para realizar el seguimiento del número de alquileres
  rentalsCount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  director: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  protagonists: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  producer: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  platform: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  releaseDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  leastRentedAgeGroup: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

module.exports = Game;
