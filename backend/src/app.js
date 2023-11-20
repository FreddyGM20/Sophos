const express = require('express');
const sequelize = require('./config/database');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Conexión a la base de datos SQLite
sequelize
  .sync()
  .then(() => {
    console.log('Conectado a la base de datos');
  })
  .catch((error) => {
    console.error('Error de conexión a la base de datos:', error);
  });

// Rutas
const customerRoutes = require('./routes/customerRoutes');
const gameRoutes = require('./routes/gameRoutes');
const rentalRoutes = require('./routes/rentalRoutes');

app.use('/customers', customerRoutes);
app.use('/games', gameRoutes);
app.use('/rentals', rentalRoutes);

app.get('/', (req, res) => {
  res.send("Welcome to my Sophos API")
})

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
