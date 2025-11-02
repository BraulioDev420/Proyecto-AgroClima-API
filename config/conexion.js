//--- Conexion a al BD MySQL
//se carga el paquete o llama a la dependencia​
const mysql = require('mysql');
const conexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});
// se abre oa conexion a la BD​
conexion.connect(
    err=>{
        if(err){
            console.log('Error al conectar a la BD: '+err)
        }
        else{
            console.log('Conectado correctamente a la BD')
        }

    }
);
// se exporta para ser usada en cualquier parte del proyecto​
module.exports=conexion;