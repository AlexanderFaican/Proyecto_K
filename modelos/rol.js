var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var rol = thinky.createModel("Rol", {
    id: type.string(),
    tipo_rol: type.string()
});

module.exports = rol;

/*
 * Relacion: Rol tiene muchas Personas 
 */
var Persona = require('./persona');
rol.hasMany(Persona, "persona", "id", "id_rol");
