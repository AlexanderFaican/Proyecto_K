var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var DetalleCompra = thinky.createModel("DetalleVenta", {
    id: type.string(),
    id_producto: type.string(),
    id_facturaV: type.string(),
    cantidad: type.number(),
    valor_unitario: type.number(),
    valor_total: type.number(),
    createdAt: type.date().default(r.now())
});

module.exports = DetalleCompra;

/*
 * Relacion: Detalle Venta pertenece a una Factura de Venta
 */
var FacturaVenta = require('./facturaVenta');
DetalleCompra.belongsTo(FacturaVenta, "facturaVenta", "id_facturaV", "id");

/*
 * Relacion: Detalle Venta tiene muchos Productos
 */
var Producto = require('./producto');
DetalleCompra.hasMany(Producto, "producto", "id_producto", "id");
