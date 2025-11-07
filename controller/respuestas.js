const conexion = require("../config/conexion");
const express = require("express");
const ruta = express();
const bodyParser = require("body-parser");
ruta.use(bodyParser.json());

// Obtener  respuestas de una publicación
// http://localhost:3300/respuestas/publicacion/5
ruta.get("/respuestas/publicacion/:id_publicacion", (req, res) => {
  const { id_publicacion } = req.params;
  const sql = `
    SELECT * FROM respuestas 
    WHERE id_publicacion = ? AND EstLogico = 1
    ORDER BY fecha_respuesta ASC
  `;
  conexion.query(sql, [id_publicacion], (err, resultado) => {
    if (err) return res.status(500).json({ error: err });
    res.json(resultado);
  });
});

//obtener todas las respuestas activas
// http://localhost:3300/respuestas/activos/
ruta.get("/respuestas/activos/", (req, res) => {
  let sql =
    "SELECT * FROM respuestas WHERE EstLogico = 1 ORDER BY id_respuesta DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener una respuesta por id si esta activa
// http://localhost:3300/respuestas/5
ruta.get("/respuestas/activos/:id", (req, res) => {
  conexion.query(
    "SELECT * FROM respuestas WHERE id_respuesta = ? AND EstLogico = 1",
    [req.params.id],
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

// obtener todas las respuestas sin importar si están activas o no
// http://localhost:3300/respuestas/
ruta.get("/respuestas/", (req, res) => {
  let sql = "SELECT * FROM respuestas ORDER BY id_respuesta DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener una respuesta por id sin importa si esta activas o no
// http://localhost:3300/respuestas/5
ruta.get("/respuestas/:id", (req, res) => {
  conexion.query(
    "SELECT * FROM respuestas WHERE id_respuesta = ?",
    [req.params.id],
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

//delete logico de una respuesta
// http://localhost:3300/respuestas/5
ruta.put("/respuestas/:id", (req, res) => {
  conexion.query(
    "UPDATE respuestas SET EstLogico = 0 WHERE id_respuesta = ?",
    [req.params.id],
    (err, results) => {
      if (err) throw err;
      if (results.affectedRows)
        res.json({ mensaje: "Respuesta eliminada", codigo: "Ok" });
      else res.json({ mensaje: "Error al eliminar", codigo: "-1" });
    }
  );
});

//nueva respuesta
// http://localhost:3300/respuestas/
ruta.post("/respuestas/", (req, res) => {
  let sql = `
  INSERT INTO respuestas (id_publicacion, id_usuario, contenido, fecha_respuesta, Estlogico) 
  VALUES (?, ?, ?, NOW(), 1)
`;
  let data = [req.body.id_publicacion, req.body.id_usuario, req.body.contenido];
  conexion.query(sql, data, (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: "Respuesta guardada", codigo: "Ok" });
    else res.json({ mensaje: "No se pudo guardar", codigo: "-1" });
  });
});

//actualizar una respuesta
// http://localhost:3300/respuestas/
ruta.put("/respuestas/", (req, res) => {
  let sql =
    "UPDATE respuestas SET id_publicacion = ?, id_usuario = ?, contenido = ?, fecha_respuesta = ? WHERE id_respuesta = ? AND EstLogico = 1";
  conexion.query(
    sql,
    [
      req.body.id_publicacion,
      req.body.id_usuario,
      req.body.contenido,
      req.body.fecha_respuesta,
      req.body.id_respuesta,
    ],
    (error, results) => {
      if (error) throw error;
      if (results.affectedRows)
        res.json({ mensaje: "Respuesta actualizada", codigo: "Ok" });
      else res.json({ mensaje: "No se pudo actualizar", codigo: "-1" });
    }
  );
});

module.exports = ruta;
