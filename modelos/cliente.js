var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var Cliente = thinky.createModel("Cliente", {
    id: type.string(),
    external_id: type.string().default(r.uuid()),
    apellidos: type.string(),
    nombres: type.string(),
    direccion: type.string(),
    telefono: type.string(),
    cedula: type.string(),
    createdAt: type.date().default(r.now())
});
module.exports = Cliente;

/*
 * Relacion: Cliente tiene muchas Factura de Venta(las cuales las hace la empresa)
 */
var FacturaVenta = require('./facturaVenta');
Cliente.hasMany(FacturaVenta, "facturaVenta", "id","id_facturaCli");

