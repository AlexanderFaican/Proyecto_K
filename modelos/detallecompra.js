var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var DetalleCompra = thinky.createModel("DetalleCompra", {
    id: type.string(),
    id_producto: type.string(),
    id_facturaC: type.string(),
    cantidad: type.number(),
    valor_unitario: type.number(),
    valor_total: type.number(),
    createdAt: type.date().default(r.now())
});

module.exports = DetalleCompra;

/*
 * Relacion: Detalle Compra pertenece a una Factura
 */
var FacturaCompra = require('./facturaCompra');
DetalleCompra.belongsTo(FacturaCompra, "facturaCompra", "id_facturaC", "id");

/*
 * Relacion: Detalle Compra tiene muchos Productos
 */
var Producto = require('./producto');
DetalleCompra.hasMany(Producto, "producto", "id_producto", "id");
