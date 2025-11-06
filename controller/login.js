const conexion = require('../config/conexion');
const express = require("express");
const ruta = express.Router(); 

// Ruta de login
// POST http://localhost:3300/login
ruta.post('/login', (req, res) => {
  const { correo, contrasena } = req.body;

  // Validar datos
  if (!correo || !contrasena) {
    return res.status(400).json({ success: false, message: 'Faltan datos' });
  }

  // Buscar usuario activo
  const sql = 'SELECT * FROM usuarios WHERE correo = ? AND contrasena = ? AND EstLogico = 1';
  conexion.query(sql, [correo, contrasena], (err, resultados) => {
    if (err) {
      console.error('Error en la consulta:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    // Si el usuario existe
    if (resultados.length > 0) {
      const user = resultados[0];
      res.json({
        success: true,
        message: 'Inicio de sesión exitoso',
        user: {
          id_usuario: user.id_usuario,
          nombre: user.nombre,
          correo: user.correo,
          ubicacion: user.ubicacion
        }
      });
    } else {
      res.json({ success: false, message: 'Correo o contraseña incorrectos' });
    }
  });
});

module.exports = ruta; 
