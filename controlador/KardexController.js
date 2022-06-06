"use strict";

var r = require("rethinkdb");

var producto = require("../modelos/producto");
var kardex = require("../modelos/kardex");
/** 
 * @class KardexController
 */
class KardexController {
   
    /**  
     * @description Metodo para enviar la lista de productos registrados en la BD
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     * @returns Muestra el fragmento generarKardex.hbs
     */
    generarKardex(req, res) {
        var b = false;
        if (req.session.datos.rol == "Administrador") {
            b = true;
        } else {
            b = false;
        }

        var rol = req.session.datos.rol;
        var tipo = "";
        if (rol == "Usuario") {
            tipo = "/usuario";
        } else if (rol == "Administrador") {
            tipo = "/Admin";
        }
        let d = {
            title: "Kardex",
            fragmento: "generarKardex",
            productos: null,
            rol: tipo,
            tipo: b,
            error: {
                status: false,
                message: ""
            }
        };
        producto
                .then(function (productos) {
                    d.productos = productos;
                    res.render("index", d);
                })
                .catch(function (error) {
                    d.error.status = true;
                    d.error.message =
                            "Ocurrió un error al obtener la información de los productos disponibles";
                    res.render("index", d);
                });
    }

    /**  
     * @description Metodo que ayuda a obtener el kardex de un producto por orden de fecha 
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     */
    getItemsKardexByIdProductoOrderByFecha(req, res) {
        kardex
                .filter({
                    id_producto: req.body.id_producto
                })
                .orderBy("createdAt")
                .then(function (items) {
                    
                    let Producto = require("../modelos/producto");
                    Producto.filter({
                        id: items[items.length - 1].id_producto
                    })
                            .then(function (productos) {
                                if (productos.length > 0) {
                                    var objeto = productos[0];
                                    objeto.precio = items[items.length - 1].e_valor_unitario;

                                    objeto
                                            .save()
                                            .then(function (result) {
                                                console.log("SE MODIFICO EL VALOR UNITARIO DEL PRODUCTO");
                                            })
                                            .error(function (error) {
                                                console.log(error);
                                                console.log("NO SE PUDO MODIFICAR EL VALOR UNITARIO DEL PRODUCTO");
                                            });
                                }
                            })
                            .error(function (error) {
                                req.flash("error", "Se produjo un error");
                                res.redirect("/administracion/productos");
                            });

                    res.json({
                        code: 0,
                        data: "",
                        items_kardex: items
                    });
                })
                .catch(function (error) {
                    res.json({
                        code: -1,
                        data: "Error al obtener los registros del kardex"
                    });
                });
    }

    /**  
     * @description Metodo que ayuda a obtener el libro diario
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     * @returns Retorna la atributos basicos para generar libro diario
     */
    LibroDiario(req, res) {

        var data = {};
        var asiento = require('../modelos/asientoContable');
        asiento.then(function (lista) {


            lista.forEach(function (item, index) {


                data[index] = {
                    descripcion: item.descripcion + " con una cantidad de " + item.cantidad + " unidades, por un monto de : $ " + item.monto,
                    fecha: item.fecha,
                    monto: item.monto,
                    referencia: item.referencia,
                    id_producto: item.id_producto,
                    tipo: item.descripcion
                };

            });


            res.json(data);



        });


    }
}

module.exports = KardexController;