var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var FacturaCompra = thinky.createModel("FacturaCompra", {
    id: type.string(),
    id_empresa: type.string(),
    nro_factura: type.string(),
    fecha_compra: type.date().default(r.now()),
    subtotal: type.number(),
    iva: type.number(),
    total: type.number(),
    createdAt: type.date().default(r.now())
});

module.exports = FacturaCompra;

/*
 * Relacion: Factura Compra pertenece a una Empresa
 */
var Empresa = require('./empresa');
FacturaCompra.belongsTo(Empresa, "empresa", "id_empresa", "id");

/*
 * Relacion: Factura Compra tiene muchos Detalles de Compra
 */
var DetalleCompra = require('./detallecompra');
FacturaCompra.hasMany(DetalleCompra, "detallecompra", "id", "id_facturaC");