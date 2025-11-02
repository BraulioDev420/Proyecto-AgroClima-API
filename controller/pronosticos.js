const conexion = require('../config/conexion');
const express = require("express");
const ruta = express();
const bodyParser = require('body-parser');
ruta.use(bodyParser.json());

// Obtener todos los pronosticos activos
// http://localhost:3300/pronosticos/activos/
ruta.get('/pronosticos/activos/', (req, res) => {
  let sql = "SELECT * FROM pronosticos WHERE EstLogico = 1 ORDER BY id_pronostico DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener un cultivo activo por ID
// http://localhost:3300/pronosticos/activos/5
ruta.get('/pronosticos/activos/:id', (req, res) => {
  conexion.query("SELECT * FROM pronosticos WHERE id_pronostico = ? AND EstLogico = 1", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener todos los pronosticos sin importar si estan activos o no
// http://localhost:3300/pronosticos/
ruta.get('/pronosticos/', (req, res) => {
  let sql = "SELECT * FROM pronosticos ORDER BY id_pronostico DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener un pronostico por id sin importar si esta activo o no
// http://localhost:3300/pronosticos/5
ruta.get('/pronosticos/:id', (req, res) => {
  conexion.query("SELECT * FROM pronosticos WHERE id_pronostico = ?", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// http://localhost:3300/pronosticos/5
ruta.put('/pronosticos/:id', (req, res) => {
  conexion.query("UPDATE pronosticos SET EstLogico = 0 WHERE id_pronostico = ?", [req.params.id], (err, results) => {
    if (err) throw err;
    if (results.affectedRows)
      res.json({ mensaje: 'Pronóstico eliminado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'Error al eliminar', codigo: '-1' });
  });
});

// http://localhost:3300/pronosticos/
ruta.post('/pronosticos/', (req, res) => {
  let sql = "INSERT INTO pronosticos SET ?";
  let data = {
    id_usuario: req.body.id_usuario,
    fecha: req.body.fecha,
    temperatura: req.body.temperatura,
    humedad: req.body.humedad,
    precipitacion: req.body.precipitacion,
    alerta: req.body.alerta,
    EstLogico: 1
  };
  conexion.query(sql, data, (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: 'Pronóstico registrado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'No se pudo guardar', codigo: '-1' });
  });
});

// PUT actualizar pronosticos
// http://localhost:3300/pronosticos/
ruta.put('/pronosticos/', function(req, res) {
  let sql = "UPDATE pronosticos SET id_usuario = ?, fecha = ?, temperatura = ?, humedad = ?, precipitacion = ?, alerta = ? WHERE id_pronostico = ? AND EstLogico = 1";
  console.log('Parámetros:', [req.body.id_usuario, req.body.fecha, req.body.temperatura, req.body.humedad, req.body.precipitacion, req.body.alerta, req.body.id_pronostico]);
  conexion.query(sql, [req.body.id_usuario, req.body.fecha, req.body.temperatura, req.body.humedad, req.body.precipitacion, req.body.alerta, req.body.id_pronostico], function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ mensaje: 'Registro actualizado', codigo: 'OK' });
    } else {
      res.json({ mensaje: 'No se pudo actualizar el usuario no existe', codigo: '-1' });
    }
  }); 
});

module.exports = ruta;
