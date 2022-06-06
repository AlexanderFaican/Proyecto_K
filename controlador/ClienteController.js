'use strict';

var cliente = require('../modelos/cliente');
/** 
 * @class ClienteController
 */
class ClienteController {
    /**  
     * @description Metodo para Modificar un determinado Cliente
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @returns  Presentamos la vista Clientes
     */
    visualizar(req, res) {
        cliente.then(function (lista) {
            console.log("+++++++++++++++++++++++++++++");
            console.log(lista[0]);
            console.log(lista);
            var b = false;
            if (req.session.datos.rol == "Administrador") {
                b = true;
            } else {
                b = false;
            }
            res.render('index', {
                title: 'Clientes',
                fragmento: 'Clientes',
                lista: lista,
                tipo: b,
                msg: {
                    error: req.flash('error'),
                    info: req.flash('info')
                }
            });

        });

    }
    /**  
     * @description Metodo para GUARDAR un determinado Cliente
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @return Retornamos la vista Clientes
     */
    guardar(req, res) {
        
        cliente.filter({cedula: req.body.cedula2}).then(function (lista){

            if (lista.length >= 1){
                req.flash('error', 'El cliente ya está registrado');
                    res.redirect('/Clientes');
            } else {
                var dataP = {
                    cedula: req.body.cedula2,
                    apellidos: req.body.apellidos2,
                    nombres: req.body.nombres2,
                    direccion: req.body.direccion2,
                    telefono: req.body.telefono2
                };
                var clienteC = new cliente(dataP);
               
        
                clienteC.saveAll().then(function (result) {
                    req.flash('info', 'Se ha registrado correctamente');
                    res.redirect('/Clientes');
                }).error(function (error) {
                    req.flash('error', 'Hubo un problema, comunicate con tu servicio del sistema');
                    res.redirect('/Clientes');
                });
            }

        });


    }
    /**  
     * @description Metodo para MODIFICAR un determinado Cliente
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @returns Retornamos a la vista Clientes
     */
    
   
    modificar(req, res) {
        cliente.filter({id: req.body.idCliente}).then(function (yanela) {
            if (yanela.length > 0) {
                var rojas = yanela[0];

                rojas.nombres = req.body.nombres;
                rojas.apellidos = req.body.apellidos;
                rojas.direccion = req.body.direccion;
                rojas.telefono = req.body.telefono;
                
                rojas.saveAll().then(function (result) {
                    req.flash('info', 'Se ha modificado correctamente');
                    res.redirect('/Clientes');
                }).error(function (error) {
                    console.log(error);
                    req.flash('error', 'No se pudo modificar');
                    res.redirect('/Clientes');
                });


            } else {
                req.flash('error', 'No existe el dato a buscar');
                res.redirect('/Clientes');
            }
        }).error(function (error) {
            req.flash('error', 'se produjo un error');
            res.redirect('/Clientes');
        });
    }
    
    /**  
     * @description Metodo para BUSCAR un determinado Cliente de tipo GET
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Parapresentar los datos en  Front end
     * @property {var} Criterio enviado de la peticion get
     * @return Retorna la persona en base al criterio establecido
     */
    buscarCliente(req, res) {
      
        var criterio = req.query.criterio;
        var texto = req.query.texto;
        var data = {};
        if (criterio === 'todos') {
            cliente.then(function (lista) {
                lista.forEach(function (item, index) {
                    data[index] = {
                        id: item.id,
                        apellidos: item.apellidos,
                        nombres: item.nombres,
                        direccion: item.direccion,
                        cedula: item.cedula,
                        telefono: item.telefono
                    };
                });
                res.json(data);

            });
        } else if (criterio === "cedula") {
            cliente.filter({cedula: texto}).then(function (lista) {

                lista.forEach(function (item, index) {
                    data[index] = {
                        id: item.id,
                        apellidos: item.apellidos,
                        nombres: item.nombres,
                        direccion: item.direccion,
                        cedula: item.cedula,
                        telefono: item.telefono
                    };
                });
                res.json(data);
            }).error(function (error) { });
        } 
    }

}
module.exports = ClienteController;