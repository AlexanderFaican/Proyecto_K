var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var AsientoContable= thinky.createModel("AsientoContable", {
    id: type.string(),
    external_id: type.string().default(r.uuid()),
    descripcion: type.string(), 
    fecha: type.date().default(r.now()),
    monto: type.number(),
    cantidad: type.string(),
    referencia: type.string(),
    id_producto: type.string(),
    createdAt: type.date().default(r.now())
});
module.exports =AsientoContable;

