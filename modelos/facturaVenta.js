var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var FacturaVenta = thinky.createModel("FacturaVenta", {
    id: type.string(),
    nro_factura: type.string(),
    fecha_venta: type.date().default(r.now()),
    subtotal: type.number(),
    iva: type.number(),
    total: type.number(),
    id_facturaCli:type.string(),
    createdAt: type.date().default(r.now())
});

module.exports = FacturaVenta;
/*
 * Relacion: Factura Venta tiene muchos Detalles de Venta
 * @type Module detalleVenta|Module detalleVenta
 */
var DetalleVenta = require('./detalleVenta');
FacturaVenta.hasMany(DetalleVenta, "detalleventa", "id", "id_facturaV");

/*
 * Relacion: Factura Venta pertenece a un Cliente
 */
var Cliente = require('./cliente');
FacturaVenta.belongsTo(Cliente, "cliente", "id_facturaCli", "id");