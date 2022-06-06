/*
 * Establece la conexion entre la BASE DE DATOS y la Pagina WEB
 */
require('dotenv').config();
var thinky = require('thinky')({
	//thinky's options
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	db: process.env.DB_NAME
});

module.exports = thinky;


