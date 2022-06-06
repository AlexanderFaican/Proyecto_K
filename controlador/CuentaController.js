'use strict';
var cuentaC = require('../modelos/cuenta');
var personaC = require('../modelos/persona');
/** 
 * @class Cuenta_Controller
 */
class Cuenta_Controller {

    /**  
     * @description Metodo para El Inicio de Sesion
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @property {object} Determinamos si la cuenta existe , para luego preguntar si lso datos ingresados son correctos.
     */
    iniciar_sesion(req, res) {
        cuentaC.getJoin({
            persona: true
        }).filter({
            correo: req.body.correo
        }).run().then(function (andrea) {


            if (andrea.length > 0) {
                console.log(andrea);
                var cuenta = andrea[0];
                console.log(cuenta.persona.id_rol + "  dasdas");
                personaC.getJoin({
                    rol: true
                }).filter({
                    id_rol: cuenta.persona.id_rol
                }).run().then(function (faican) {
                    var persona = faican[0];


                    if (cuenta.clave === req.body.contra) {
                        /*
                         * Guarda datos de session de la persona que se registro
                         */

                        req.session.datos = {
                            id: cuenta.id_persona,
                            usuario: (cuenta.persona.apellidos + " " + cuenta.persona.nombres),
                            rol: persona.rol.tipo_rol
                        };
                        console.log("entro correctamente ");



                        if (persona.rol.tipo_rol == 'Administrador') {
                            //Permite redirigir a la pagina principal del Administrador  
                            res.redirect('/Admin');


                        } else if (persona.rol.tipo_rol == 'Usuario') {
                            //Permite redirigir a la pagina principal del Usuario
                            res.redirect("/usuario");


                        }

                    } else {
                        req.flash('error', 'Sus credenciales son incorrectas!');
                        res.redirect('/');

                    }

                });
            } else {

                

                req.flash('error', 'Sus credenciales son incorrectas!');

                res.redirect('/');
            }
        });


    }
    /**  
     * @description Metodo para El Cerar Sesion
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @returns  Cuando cerramos secion nos direccionamos ala principal
     */

   
    cerrar_sesion(req, res) {
        req.flash('info', 'Ha salido del sistema!');
        req.session.destroy();
        res.redirect('/');
    }

}
module.exports = Cuenta_Controller;