var thinky = require('../config/thinky_init');
var type = thinky.type;
var r = thinky.r;
var Persona = thinky.createModel("Persona", {
    id: type.string(),
    external_id: type.string().default(r.uuid()), 
    apellidos: type.string(), 
    nombres: type.string(), 
    fecha_nac: type.date(),
    edad: type.number(),
    id_rol: type.string(),
    createdAt: type.date().default(r.now())
});
module.exports = Persona;
var Cuenta = require("./cuenta");
var FacturaVenta = require("./facturaVenta");


/*
 * Relacion: Persona tiene una Cuenta
 */
Persona.hasOne(Cuenta, "cuenta", "id", "id_persona");

/*
 * Relacion: Persona tiene muchas Factura Venta(las cuales las realiza la empresa)
 */
Persona.hasMany(FacturaVenta, "facturaVenta", "id", "id_persona");


/*
 *  Relacion: Persona pertenece a un rol
 */
var Rol = require('./rol');
Persona.belongsTo(Rol, "rol", "id_rol", "id");
