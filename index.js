// Cargar variables de entorno (.env)
require('dotenv').config();

// Importar dependencias
const express = require("express");
const cors = require("cors");
const app = express();

// Middleware para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Habilitar CORS (permite conectar con Angular o cualquier frontend)
app.use(cors({
  origin: '*', // Puedes reemplazar '*' por la URL del frontend en producción
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Importar rutas
const rutas = require('./routes/rutas');

// Usar rutas en la app
app.use('/', rutas);

// Puerto dinámico (Render usa process.env.PORT automáticamente)
const PORT = process.env.PORT || 3300;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en el puerto ${PORT}`);
  console.log(`🌐 Disponible en: http://localhost:${PORT}/`);
});

// Exportar app (útil para testing o integración)
module.exports = app;
