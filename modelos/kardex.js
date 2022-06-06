var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var Kardex = thinky.createModel("Kardex", {
    id: type.string(),
    id_factura: type.string(),
    id_producto: type.string(),
    tipo: type.number(), //0 entrada, 1 salida
    descripcion: type.string(),
    createdAt: type.date().default(r.now()),
    es_cantidad: type.number(),
    es_valor_unitario: type.number(),
    es_valor_total: type.number(),
    e_cantidad: type.number(),
    e_valor_unitario: type.number(),
    e_valor_total: type.number()
});

module.exports = Kardex;

/*
 *  Kardex pertenece a un producto
 */
var Producto = require('./producto');
Kardex.belongsTo(Producto, "producto", "id_producto", "id");
