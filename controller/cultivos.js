const conexion = require("../config/conexion");
const express = require("express");
const ruta = express();
const bodyParser = require("body-parser");
ruta.use(bodyParser.json());

// Obtener todos los cultivos activos de un usuario
// http://localhost:3300/cultivos/usuario/16
ruta.get("/cultivos/usuario/:id_usuario", (req, res) => {
  const id_usuario = req.params.id_usuario;
  const sql = `
    SELECT * 
    FROM cultivos 
    WHERE id_usuario = ? 
      AND EstLogico = 1 
    ORDER BY id_cultivo DESC
  `;

  conexion.query(sql, [id_usuario], (err, rows) => {
    if (err) {
      console.error("Error al obtener cultivos del usuario:", err);
      return res.status(500).json({
        mensaje: "Error al obtener cultivos del usuario",
        codigo: "-1",
      });
    }

    if (rows.length === 0) {
      return res.json({
        mensaje: "No se encontraron cultivos activos para este usuario",
        codigo: "0",
        data: [],
      });
    }

    res.json({
      mensaje: "Cultivos activos encontrados",
      codigo: "OK",
      data: rows,
    });
  });
});

// Obtener todos los cultivos activos
// http://localhost:3300/cultivos/activos/
ruta.get("/cultivos/activos/", (req, res) => {
  let sql =
    "SELECT * FROM cultivos WHERE EstLogico = 1 ORDER BY id_cultivo DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

//obtener un cultivo activo por ID
// http://localhost:3300/cultivos/activos/5
ruta.get("/cultivos/activos/:id", (req, res) => {
  conexion.query(
    "SELECT * FROM cultivos WHERE id_cultivo = ? AND EstLogico = 1",
    [req.params.id],
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

//todos los cultivos sin importa si estan activos o inactivos
// http://localhost:3300/cultivos/
ruta.get("/cultivos/", (req, res) => {
  let sql = "SELECT * FROM cultivos ORDER BY id_cultivo DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    res.json(rows);
  });
});

// cultivo por ID sin importar su estado
// http://localhost:3300/cultivos/5
ruta.get("/cultivos/:id", (req, res) => {
  conexion.query(
    "SELECT * FROM cultivos WHERE id_cultivo = ?",
    [req.params.id],
    (err, rows) => {
      if (err) throw err;
      res.json(rows);
    }
  );
});

// DELETE logico cultivo por ID
// http://localhost:3300/cultivos/:id
ruta.put("/cultivos/:id", (req, res) => {
  const id_cultivo = req.params.id;

  const sql = [
    "UPDATE riegos SET EstLogico = 0 WHERE id_cultivo = ?",
    "UPDATE registros_productividad SET EstLogico = 0 WHERE id_cultivo = ?",
    "UPDATE cultivos SET EstLogico = 0 WHERE id_cultivo = ?",
  ];

  const ejecutarSQLs = (indice = 0) => {
    if (indice >= sql.length) {
      return res.json({
        mensaje: "Cultivo y datos relacionados eliminados lógicamente",
        codigo: "Ok",
      });
    }

    conexion.query(sql[indice], [id_cultivo], (err, results) => {
      if (err) {
        console.error("Error al eliminar en cascada:", err);
        return res.json({
          mensaje: "Error al eliminar datos relacionados",
          codigo: "-1",
        });
      }
      ejecutarSQLs(indice + 1); // 👈 aquí estaba el error tipográfico
    });
  };

  // Iniciar eliminación en cascada
  ejecutarSQLs();
});

// POST nuevo cultivo
// http://localhost:3300/cultivos/
ruta.post("/cultivos/", (req, res) => {
  let sql = "INSERT INTO cultivos SET ?";
  let data = {
    id_usuario: req.body.id_usuario,
    tipo_cultivo: req.body.tipo_cultivo,
    fecha_siembra: req.body.fecha_siembra,
    fecha_cosecha: req.body.fecha_cosecha,
    estado: req.body.estado,
    EstLogico: 1,
  };
  conexion.query(sql, data, (error, results) => {
    if (error) throw error;
    if (results.affectedRows)
      res.json({ mensaje: "Cultivo registrado", codigo: "Ok" });
    else res.json({ mensaje: "No se pudo guardar", codigo: "-1" });
  });
});

// PUT actualizar cultivo
// http://localhost:3300/cultivos/
ruta.put("/cultivos/", function (req, res) {
  let sql =
    "UPDATE cultivos SET id_usuario = ?, tipo_cultivo = ?, fecha_siembra = ?, fecha_cosecha = ?, estado = ? WHERE id_cultivo = ? AND EstLogico = 1";
  console.log("Parámetros:", [
    req.body.id_usuario,
    req.body.tipo_cultivo,
    req.body.fecha_siembra,
    req.body.fecha_cosecha,
    req.body.estado,
    req.body.id_cultivo,
  ]);
  conexion.query(
    sql,
    [
      req.body.id_usuario,
      req.body.tipo_cultivo,
      req.body.fecha_siembra,
      req.body.fecha_cosecha,
      req.body.estado,
      req.body.id_cultivo,
    ],
    function (error, results) {
      if (error) throw error;
      if (results.affectedRows) {
        res.json({ mensaje: "Registro actualizado", codigo: "OK" });
      } else {
        res.json({
          mensaje: "No se pudo actualizar el usuario no existe",
          codigo: "-1",
        });
      }
    }
  );
});

module.exports = ruta;
