'use strict';


var usuario = require('../modelos/persona');
var cuenta = require('../modelos/cuenta');
var rol = require('../modelos/rol');
/** 
 * @class controladorPersona
 */
class controladorPersona {
    /**  
     * @description Metodo para Guardar un determinado Usuario 
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @property {object} Quemamos los datos de los usuario , en el sistema cuando cargamos la pantalla principal
     */

    guardar_Usuario(req, res) {
        console.log('Ejecutado');
        var rol = require('../modelos/rol');
        rol.run().then(function (roles) {
            if (roles.length <= 0) {
                rol.save([{
                    tipo_rol: "Administrador"
                }, {
                    tipo_rol: "Usuario"
                }]);
            }
            usuario.run().then(function (person) {
                rol.filter({
                    tipo_rol: "Usuario"
                }).run().then(function (roles) {
                    var rol = roles[0];

                    if (person.length <= 0) {
                        var datos = {

                            apellidos: "Jaramillo Jumbo",
                            nombres: "Danny Michael",
                            fecha_nac: "03-10-1999",
                            edad: "20",
                            id_rol: rol.id

                        };

                        var datosC = {
                            correo: "danny@unl.edu.ec",
                            clave: "123456"

                        };



                        var Persona = new usuario(datos);
                        var Cuenta = new cuenta(datosC);
                        Persona.cuenta = Cuenta;
                        Persona.saveAll({
                            cuenta: true
                        }).then(function (result) {

                            console.log("Guardados con exito Usuario");

                        }).error(function (error) {

                            console.log("Error al guardar Usuario");

                        });
                    } else {
                        console.log("Ya esta guardado Usuario");
                    }
                });


            });

        }).error(function (error) {
            console.log("ERRROR");
            console.log(error);
        });

    }
      /**  
     * @description Metodo para Guardar un determinado  Administrador 
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @property {object} Quemamos los datos de los Admin , en el sistema , cuando cargamos la pantalla principal
     */

    guardar_Administrador(req, res) {
        var rol = require('../modelos/rol');
        rol.run().then(function (roles) {
            usuario.run().then(function (person) {


                rol.filter({
                    tipo_rol: "Administrador"
                }).run().then(function (roles) {
                    var rol = roles[0];
                    console.log(rol.id);
                    console.log("BBB" + person.length);
                    if (person.length <= 1) {
                        var datos = {

                            apellidos: "Jaramilloxxx Jumbo",
                            nombres: "Dannyxxx Michael",
                            fecha_nac: "03-10-1999",
                            edad: "20",
                            id_rol: rol.id

                        };

                        var datosC = {
                            correo: "dannyxxx@unl.edu.ec",
                            clave: "123456"

                        };


                        var Persona = new usuario(datos);
                        var Cuenta = new cuenta(datosC);
                        Persona.cuenta = Cuenta;




                        Persona.saveAll({
                            cuenta: true
                        }).then(function (result) {

                            console.log("Guardados con exito Administrador");

                        }).error(function (error) {

                            console.log("Error al guardar Administrador");

                        });
                    } else {
                        console.log("Ya esta guardado Administrador");
                    }
                });

            });

        }).error(function (error) {
            console.log("ERRROR");
            console.log(error);
        });

    }



}
module.exports = controladorPersona;