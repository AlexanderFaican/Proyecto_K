var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var Cuenta = thinky.createModel("Cuenta", {
    id: type.string(),
    external_id: type.string().default(r.uuid()), 
    correo: type.string(),
    clave: type.string(),
    createdAt: type.date().default(r.now()),
    updatedAt: type.date().default(r.now()),
    id_persona: type.string()
});

module.exports = Cuenta;
/*
 * Relacion: Cuenta pertenece a una Persona
 */
var Persona = require('./persona');
Cuenta.belongsTo(Persona, "persona", "id_persona", "id");






