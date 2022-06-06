var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var Producto = thinky.createModel("Producto", {
    id: type.string(),
    nombre: type.string(),
    categoria: type.string(),
    precio: type.number(),
    stock: type.number(),
    descripcion: type.string(),
    
    createdAt: type.date().default(r.now())
});
//estado_inicial: type.number(),
module.exports = Producto;


