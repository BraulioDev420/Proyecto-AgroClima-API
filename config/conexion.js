// --- Conexion a la BD MySQL usando pool ---
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'maglev.proxy.rlwy.net',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'agroclima13',
  port: process.env.DB_PORT || 10898, // usa el puerto público de Railway
  waitForConnections: true,
  connectionLimit: 10,   // número máximo de conexiones simultáneas
  queueLimit: 0          // sin límite de cola
});

// Probar conexión inicial
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al conectar a la BD:', err);
  } else {
    console.log('Conectado correctamente a la BD');
    connection.release(); // liberar la conexión al pool
  }
});

// Exportar el pool para usar en cualquier parte del proyecto
module.exports = pool;
