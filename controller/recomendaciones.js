const conexion = require('../config/conexion');
const express = require("express");
const ruta = express();
const bodyParser = require('body-parser');
ruta.use(bodyParser.json());

// Obtener todas las recomendaciones activas
// http://localhost:3300/recomendaciones/activos
ruta.get('/recomendaciones/activos/', (req, res) => {
  let sql = "SELECT * FROM recomendaciones WHERE EstLogico = 1 ORDER BY id_recomendacion DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener una recomendacion activa por ID
// http://localhost:3300/recomendaciones/activos/5
ruta.get('/recomendaciones/activos/:id', (req, res) => {
  conexion.query("SELECT * FROM recomendaciones WHERE id_recomendacion = ? AND EstLogico = 1", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// obtener todas las recomendaciones sin importat si estan activas o no
// http://localhost:3300/recomendaciones/
ruta.get('/recomendaciones/', (req, res) => {
  let sql = "SELECT * FROM recomendaciones ORDER BY id_recomendacion DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener una recomendacion por id sin importar si esta activo o inactivo
// http://localhost:3300/recomendaciones/5
ruta.get('/recomendaciones/:id', (req, res) => {
  conexion.query("SELECT * FROM recomendaciones WHERE id_recomendacion = ?", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// DELETE logico recomendacion por ID
// http://localhost:3300/recomendaciones/5
ruta.put('/recomendaciones/:id', (req, res) => {
  conexion.query("UPDATE recomendaciones SET EstLogico = 0 WHERE id_recomendacion = ?", [req.params.id], (err, results) => {
    if (err) throw err;
    if (results.affectedRows)
      res.json({ mensaje: 'Recomendación eliminada', codigo: 'Ok' });
    else
      res.json({ mensaje: 'Error al eliminar', codigo: '-1' });
  });
});

// http://localhost:3300/recomendaciones/
ruta.post('/recomendaciones/', (req, res) => {
  let sql = "INSERT INTO recomendaciones SET ?";
  let data = {
    id_usuario: req.body.id_usuario,
    tipo: req.body.tipo,
    descripcion: req.body.descripcion,
    fecha_generada: req.body.fecha_generada,
    EstLogico: 1
  };
  conexion.query(sql, data, (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: 'Recomendación guardada', codigo: 'Ok' });
    else
      res.json({ mensaje: 'No se pudo guardar', codigo: '-1' });
  });
});

// PUT actualizar recomendaciones
// http://localhost:3300/recomendaciones/
ruta.put('/recomendaciones/', function(req, res) {
  let sql = "UPDATE recomendaciones SET id_usuario = ?, tipo = ?, descripcion = ?, fecha_generada = ? WHERE id_recomendacion = ? AND EstLogico = 1";
  console.log('Parámetros:', [req.body.id_usuario, req.body.tipo, req.body.descripcion, req.body.fecha_generada, req.body.id_recomendacion]);
  conexion.query(sql, [req.body.id_usuario, req.body.tipo, req.body.descripcion, req.body.fecha_generada, req.body.id_recomendacion], function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ mensaje: 'Registro actualizado', codigo: 'OK' });
    } else {
      res.json({ mensaje: 'No se pudo actualizar el usuario no existe', codigo: '-1' });
    }
  }); 
});

module.exports = ruta;
