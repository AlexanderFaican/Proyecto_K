'use strict';
/** 
 * @class EmpresaController
 */
class EmpresaController {

    /**  
     * @description Metodo para  Quemar Empresas en el Sistema
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @property {object}   Empresas Quemamos las Empresas en el sistema cuando cargamos la pantalla principal
     */

    guardar_Empresa(req, res) {

        var Emp = require('../modelos/empresa');
        Emp.run().then(function (em) {
            if (em.length <= 0) {
                var datos = {

                    nombre: "Empresa  el Paraiso"

                };
                var datos2 = {

                    nombre: "Empresa  el Don Juan"
                };
                var GE = new Emp(datos);
                var GE2 = new Emp(datos2);
                GE.saveAll().then(function (result) {
                }).error(function (error) {
                    console.log("Error al guardar Empresas");
                });
                GE2.saveAll().then(function (result) {
                }).error(function (error) {
                    console.log("Error al guardar Empresas");
                });

            }


        }).error(function (error) {
            console.log("ERRROR");
            console.log(error);
        });

    }

}

module.exports = EmpresaController;