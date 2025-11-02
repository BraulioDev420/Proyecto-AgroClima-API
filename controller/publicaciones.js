const conexion = require('../config/conexion');
const express = require("express");
const ruta = express();
const bodyParser = require('body-parser');
ruta.use(bodyParser.json());

//obtener todas las publicaciones activas
// http://localhost:3300/publicaciones/activas/
ruta.get('/publicaciones/activas/', (req, res) => {
  let sql = "SELECT * FROM publicaciones WHERE EstLogico = 1 ORDER BY id_publicacion DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener una publicaciones activa por ID
// http://localhost:3300/publicaciones/5
ruta.get('/publicaciones/activas/:id', (req, res) => {
  conexion.query("SELECT * FROM publicaciones WHERE id_publicacion = ? AND EstLogico = 1", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// Obtener todas las publicaciones sin importar si estan activas o no
// http://localhost:3300/publicaciones/
ruta.get('/publicaciones/', (req, res) => {
  let sql = "SELECT * FROM publicaciones ORDER BY id_publicacion DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// Obtener una publicaciones por id sin importar si esta activa o no
// http://localhost:3300/publicaciones/5
ruta.get('/publicaciones/:id', (req, res) => {
  conexion.query("SELECT * FROM publicaciones WHERE id_publicacion = ?", [req.params.id], (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// DELETE logico publicaciones por ID
// http://localhost:3300/publicaciones/5
ruta.put('/publicaciones/:id', (req, res) => {
  const id_publicacion = req.params.id;

  const sql = [
    "UPDATE respuestas SET EstLogico = 0 WHERE id_publicacion = ?",
    "UPDATE publicaciones SET EstLogico = 0 WHERE id_publicacion = ?",
  ];

  const ejecutarSQLs = (indice = 0) => {
    if (indice >= sql.length) {
      return res.json({
        mensaje: 'Cultivo y datos relacionados eliminados lógicamente',
        codigo: 'Ok'
      });
    }

    conexion.query(sql[indice], [id_publicacion], (err, results) => {
      if (err) {
        console.error("Error al eliminar en cascada:", err);
        return res.json({
          mensaje: 'Error al eliminar datos relacionados',
          codigo: '-1'
        });
      }
      ejecutarSQLs(indice + 1); // 👈 aquí estaba el error tipográfico
    });
  };

  // Iniciar eliminación en cascada
  ejecutarSQLs();
});

// Crear una nueva publicaciones
// http://localhost:3300/publicaciones/
ruta.post('/publicaciones/', (req, res) => {
  let sql = "INSERT INTO publicaciones SET ?";
  let data = {
    id_usuario: req.body.id_usuario,
    contenido: req.body.contenido,
    fecha_publicacion: req.body.fecha_publicacion,
    EstLogico: 1
  };
  conexion.query(sql, data, (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: 'publicaciones registrada', codigo: 'Ok' });
    else
      res.json({ mensaje: 'No se pudo guardar', codigo: '-1' });
  });
});

// PUT actualizar publicaciones
// http://localhost:3300/publicaciones/
ruta.put('/publicaciones/', function(req, res) {
  let sql = "UPDATE publicaciones SET contenido = ?, fecha_publicacion = ? WHERE id_publicacion = ?";
  console.log('Parámetros:', [req.body.contenido, req.body.fecha_publicacion, req.body.id_publicacion]);
  conexion.query(sql, [req.body.contenido, req.body.fecha_publicacion, req.body.id_publicacion], function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ mensaje: 'Registro actualizado', codigo: 'OK' });
    } else {
      res.json({ mensaje: 'No se pudo actualizar, la publicación no existe', codigo: '-1' });
    }
  }); 
});

module.exports = ruta;
