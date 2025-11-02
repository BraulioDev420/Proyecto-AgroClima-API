const conexion = require('../config/conexion');
const express = require("express");
const ruta = express();
const bodyParser = require('body-parser');
ruta.use(bodyParser.json());

// http://localhost:3300/
ruta.get('/', function (req, res) {
  res.json({ mensaje: '¡estoy en Index !' });
});

// muestra todos los usuarios activos
// http://localhost:3300/usuarios/activos/
ruta.get('/usuarios/activos/', (req, res) => {
  let sql = "SELECT * FROM usuarios WHERE EstLogico = 1 ORDER BY id_usuario DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});

//muestra un usuario por id pero solo si esta activo
// http://localhost:3300/usuarios/activos/5
ruta.get('/usuarios/activos/:id', (req, res) => {
  conexion.query("SELECT * FROM usuarios WHERE id_usuario = ? AND EstLogico = 1", [req.params.id], (err, rows) => {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});

// muestra todos los usuarios sin importar si estan activos o inactivos
// http://localhost:3300/usuarios/
ruta.get('/usuarios/', (req, res) => {
  let sql = "SELECT * FROM usuarios ORDER BY id_usuario DESC";
  conexion.query(sql, (err, rows) => {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});

//murestra un usuario por id sin importar su estado
// http://localhost:3300/usuarios/5
ruta.get('/usuarios/:id', (req, res) => {
  conexion.query("SELECT * FROM usuarios WHERE id_usuario = ?", [req.params.id], (err, rows) => {
    if (err) throw err;
    else {
      res.json(rows);
    }
  });
});


// Elimina un usuario y todos sus datos relacionados (respuestas, publicaciones, recomendaciones, pronosticos, cultivos, riegos, registros_productividad)
// http://localhost:3300/usuarios/5
ruta.put('/usuarios/:id', (req, res) => {
  const idUsuario = req.params.id;

  // Consultas SQL
  const sqls = [
    "UPDATE respuestas SET EstLogico = 0 WHERE id_usuario = ?",
    "UPDATE publicaciones SET EstLogico = 0 WHERE id_usuario = ?",
    "UPDATE recomendaciones SET EstLogico = 0 WHERE id_usuario = ?",
    "UPDATE pronosticos SET EstLogico = 0 WHERE id_usuario = ?",
    "UPDATE cultivos SET EstLogico = 0 WHERE id_usuario = ?",
    // Riegos relacionados con los cultivos del usuario
    `UPDATE riegos 
     SET EstLogico = 0 
     WHERE id_cultivo IN (SELECT id_cultivo FROM cultivos WHERE id_usuario = ?)`,
    // Registros de productividad relacionados con los cultivos del usuario
    `UPDATE registros_productividad 
     SET EstLogico = 0 
     WHERE id_cultivo IN (SELECT id_cultivo FROM cultivos WHERE id_usuario = ?)`,
    // Finalmente el usuario
    "UPDATE usuarios SET EstLogico = 0 WHERE id_usuario = ?"
  ];

  // Función para ejecutar las consultas en orden
  const ejecutarSQLs = (indice = 0) => {
    if (indice >= sqls.length) {
      return res.json({ mensaje: '¡Usuario y todos los datos relacionados eliminados!', codigo: 'Ok' });
    }

    conexion.query(sqls[indice], [idUsuario], (err, results) => {
      if (err) {
        console.error("Error al eliminar en cascada:", err);
        return res.json({ mensaje: 'Error al eliminar datos relacionados', codigo: '-1' });
      }
      ejecutarSQLs(indice + 1); // siguiente consulta
    });
  };

  // Iniciar eliminación en cascada
  ejecutarSQLs();
});


// http://localhost:3300/usuarios/
ruta.post('/usuarios/', (req, res) => {
  let sql = "INSERT INTO usuarios SET ?";
  console.log('Registro recibido: ', req.body);
  let poststr = {
    nombre: req.body.nombre,
    correo: req.body.correo,
    contrasena: req.body.contrasena,
    ubicacion: req.body.ubicacion,
    EstLogico: 1
  };
  conexion.query(sql, poststr, function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ mensaje: 'Registro guardado', codigo: 'Ok' });
    } else {
      res.json({ mensaje: 'No se pudo guardar', codigo: '-1' });
    }
  });
});

//actualizar usuarios
// http://localhost:3300/usuarios/
ruta.put('/usuarios/', function(req, res) {
  let sql = "UPDATE usuarios SET nombre = ?, correo = ?, contrasena = ?, ubicacion = ? WHERE id_usuario = ? AND EstLogico = 1";
  conexion.query(sql, [req.body.nombre, req.body.correo, req.body.contrasena, req.body.ubicacion, req.body.id_usuario], function (error, results) {
    if (error) throw error;
    if (results.affectedRows) {
      res.json({ mensaje: 'Registro actualizado', codigo: 'OK' });
    } else {
      res.json({ mensaje: 'No se pudo actualizar el usuario no existe', codigo: '-1' });
    }
  }); 
});

module.exports = ruta;
