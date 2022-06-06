var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var Empresa = thinky.createModel("Empresa", {
    id: type.string(),
    nombre: type.string(),
    createdAt: type.date().default(r.now())
});

module.exports = Empresa;

