const conexion = require('../config/conexion');
const express = require("express");
const ruta = express();
const bodyParser = require('body-parser');
ruta.use(bodyParser.json());

// obtener todos los registro de registros_productividad por id si esta activo
// http://localhost:3300/registros_productividad/activos/
ruta.get('/registros_productividad/activos/', (req, res) => {
  let sql = "SELECT * FROM registros_productividad WHERE EstLogico = 1 ORDER BY id_registro DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener un registro de registros_productividad por id si esta activo
// http://localhost:3300/registros_productividad/activos/5
ruta.get('/registros_productividad/activos/:id', (req, res) => {
  conexion.query("SELECT * FROM registros_productividad WHERE id_registro = ? AND EstLogico = 1", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// Obtener todos los registros de registros_productividad sin importar si están activos o no
// http://localhost:3300/registros_productividad/
ruta.get('/registros_productividad/', (req, res) => {
  let sql = "SELECT * FROM registros_productividad ORDER BY id_registro DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener un registro de registros_productividad por id sin importa si esta activo o no
// http://localhost:3300/registros_productividad/5
ruta.get('/registros_productividad/:id', (req, res) => {
  conexion.query("SELECT * FROM registros_productividad WHERE id_registro = ?", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// eliminar un registro de registros_productividad (EstLogico = 0)
// http://localhost:3300/registros_productividad/5
ruta.put('/registros_productividad/:id', (req, res) => {
  conexion.query("UPDATE registros_productividad SET EstLogico = 0 WHERE id_registro = ?", [req.params.id], (err, results) => {
    if (err) throw err;
    if (results.affectedRows)
      res.json({ mensaje: 'Registro de productividad eliminado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'Error al eliminar', codigo: '-1' });
  });
});

//Nuevo registro de registros_productividad
// http://localhost:3300/registros_productividad/
ruta.post('/registros_productividad/', (req, res) => {
  let sql = "INSERT INTO registros_productividad SET ?";
  let data = {
    id_cultivo: req.body.id_cultivo,
    produccion_total: req.body.produccion_total,
    observaciones: req.body.observaciones,
    fecha_registro: req.body.fecha_registro,
    EstLogico: 1
  };
  conexion.query(sql, data, (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: 'Registro guardado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'No se pudo guardar', codigo: '-1' });
  });
});

//Actualizar un registro de registros_productividad
// http://localhost:3300/registros_productividad/
ruta.put('/registros_productividad/', (req, res) => {
  let sql = "UPDATE registros_productividad SET id_cultivo = ?, produccion_total = ?, observaciones = ?, fecha_registro = ? WHERE id_registro = ? AND EstLogico = 1";
  conexion.query(sql, [req.body.id_cultivo, req.body.produccion_total, req.body.observaciones, req.body.fecha_registro, req.body.id_registro], (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: 'Registro actualizado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'No se pudo actualizar', codigo: '-1' });
  });
});

module.exports = ruta;
