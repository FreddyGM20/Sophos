// models/rental.js

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Asegúrate de importar tu instancia de Sequelize
const Customer = require('../models/Customer')
const Game = require('../models/Game')

const Rental = sequelize.define('Rental', {
  // Otras columnas del modelo Rental
  customerId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerIdentity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  customerAge: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  rentalDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

Rental.belongsTo(Customer, { foreignKey: 'customerId' });
Rental.belongsTo(Game, { foreignKey: 'gameId' });

module.exports = Rental;
