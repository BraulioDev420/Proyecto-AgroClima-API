const conexion = require('../config/conexion');
const express = require("express");
const ruta = express();
const bodyParser = require('body-parser');
ruta.use(bodyParser.json());

//obtener todos los riegos activos
// http://localhost:3300/riegos/activos/
ruta.get('/riegos/activos/', (req, res) => {
  let sql = "SELECT * FROM riegos WHERE EstLogico = 1 ORDER BY id_riego DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// obtener un riego por id Activo
// http://localhost:3300/riegos/5
ruta.get('/riegos/activos/:id', (req, res) => {
  conexion.query("SELECT * FROM riegos WHERE id_riego = ? AND EstLogico = 1", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener todos los riegos sin importar si están activos o no
// http://localhost:3300/riegos/
ruta.get('/riegos/', (req, res) => {
  let sql = "SELECT * FROM riegos ORDER BY id_riego DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// obtener un riego por id sin importar si está activo o no
// http://localhost:3300/riegos/5
ruta.get('/riegos/:id', (req, res) => {
  conexion.query("SELECT * FROM riegos WHERE id_riego = ?", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//delete logico
// http://localhost:3300/riegos/5
ruta.put('/riegos/:id', (req, res) => {
  conexion.query("UPDATE riegos SET EstLogico = 0 WHERE id_riego = ?", [req.params.id], (err, results) => {
    if (err) throw err;
    if (results.affectedRows)
      res.json({ mensaje: 'riegos eliminado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'Error al eliminar', codigo: '-1' });
  });
});

//nuevo riego
// http://localhost:3300/riegos/
ruta.post('/riegos/', (req, res) => {
  let sql = "INSERT INTO riegos SET ?";
  let data = {
    id_cultivo: req.body.id_cultivo,
    fecha_riego: req.body.fecha_riego,
    cantidad_agua: req.body.cantidad_agua,
    EstLogico: 1
  };
  conexion.query(sql, data, (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: 'riegos registrado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'No se pudo guardar', codigo: '-1' });
  });
});

//actualizar riego
// http://localhost:3300/riegos/
ruta.put('/riegos/', (req, res) => {
  let sql = "UPDATE riegos SET id_cultivo = ?, fecha_riego = ?, cantidad_agua = ? WHERE id_riego = ? AND EstLogico = 1";
  conexion.query(sql, [req.body.id_cultivo, req.body.fecha_riego, req.body.cantidad_agua, req.body.id_riego], (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: 'riegos actualizado', codigo: 'Ok' });
    else
      res.json({ mensaje: 'No se pudo actualizar', codigo: '-1' });
  });
});

module.exports = ruta;
