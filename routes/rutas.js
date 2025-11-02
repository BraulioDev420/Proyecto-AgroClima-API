
//--- Rutas de acceso a nuestra API y sus métdos CRUD
const route = require("express").Router();

// Importamos todos las rutas de controladores
const usuarios = require("../controller/usuarios");
const cultivos = require("../controller/cultivos");
const pronosticos = require("../controller/pronosticos");
const riegos = require("../controller/riegos");
const recomendaciones = require("../controller/recomendaciones");
const registros_productivos = require("../controller/registros_productividad");
const publicaciones = require("../controller/publicaciones");
const respuestas = require("../controller/respuestas");

// Mantén la base en "/"
route.use("/", usuarios);
route.use("/", cultivos);
route.use("/", pronosticos);
route.use("/", riegos);
route.use("/", recomendaciones);
route.use("/", registros_productivos);
route.use("/", publicaciones);
route.use("/", respuestas);

module.exports = route;
