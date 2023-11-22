const express = require('express');
const sequelize = require('./config/database');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Habilita CORS para todas las rutas
const corsOptions = {
  origin: '*',  // Especifica el origen permitido
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos permitidos
  credentials: true,  // Habilita el intercambio de cookies entre dominios
  optionsSuccessStatus: 204, // Establece el código de estado para las opciones exitosas
};

app.use(cors(corsOptions));

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
