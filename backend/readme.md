### Backend
Este es un proyecto de backend desarrollado con Node.js y Express. Utiliza Sequelize como ORM para interactuar con la base de datos SQLite. Aquí encontrarás instrucciones sobre cómo ejecutar el proyecto y una lista de las bibliotecas utilizadas.

Comandos
Instalación de dependencias:
`npm install`

Ejecutar la aplicación:
`npm start`

- Este comando utiliza Nodemon para ejecutar la aplicación y reiniciar automáticamente cuando se realizan cambios en el código.

### Librerías utilizadas
- body-parser (v1.20.2):
Parsea los cuerpos de las solicitudes HTTP y los hace disponibles en req.body.

- cors (v2.8.5):
Middleware que habilita la política de mismo origen (CORS) para permitir solicitudes desde diferentes dominios.

- dotenv (v16.3.1):
Carga variables de entorno desde un archivo .env para mantener configuraciones sensibles fuera del código fuente.

- express (v4.18.2):
Marco de aplicación web para Node.js que simplifica la creación de API y aplicaciones web.

- sequelize (v6.35.1):
ORM (Object-Relational Mapping) para interactuar con bases de datos relacionales. En este proyecto, se utiliza para gestionar modelos y consultas a la base de datos SQLite.

- sqlite3 (v5.1.6):
Controlador de base de datos SQLite para Sequelize.

### Desarrollo
Este proyecto sigue las mejores prácticas de desarrollo de Node.js y Express. Asegúrate de tener Node.js y npm instalados localmente.

- Clona el repositorio:

`git clone <URL_DEL_REPOSITORIO>`

- Instala las dependencias:

`npm install`

- Configura variables de entorno:
Crea un archivo .env en el directorio raíz y define las variables de entorno necesarias (por ejemplo, el puerto en el que se ejecutará la aplicación).

Ejecuta la aplicación en modo desarrollo:

`npm start`

- Nota: La aplicación estará disponible en http://localhost:3000.
