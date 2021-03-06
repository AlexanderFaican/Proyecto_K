"use strict";


var Producto = require("../modelos/producto");
/** 
 * @class ProductoController
 */
class ProductoController {
    /**  
     * @description Metodo para extraer  todos los productos de la BD.
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     * @return Retornamos la vista de Producto.hbs
     */
    visualizar(req, res) {
        Producto.then(function (lista) {
            lista.forEach(element => {
                console.log("LISTANDO------------------" + element.nombre + " id: " + element.id + "precio Uni : " + element.precio);
                let kardex = require("../modelos/kardex");
                
                kardex.filter({
                        id_producto: element.id
                    }).orderBy("createdAt").then(function (items) {
                        console.log(items[items.length - 1]);
                        if ((items.length - 1) >= 1) {
                            console.log(
                                "MODIFICO EL PRECIO EN LA TABLA-----------------------------------------"
                            );
                            element.precio = items[items.length - 1].e_valor_unitario;
                            
                            element.save().then(function (result) {
                                    console.log("SE MODIFICO EL VALOR UNITARIO DEL PRODUCTO");

                                })
                                .error(function (error) {
                                    console.log(error);
                                    console.log("NO SE PUDO MODIFICAR EL VALOR UNITARIO DEL PRODUCTO");
                                });

                        } else {
                            console.log(
                                "NO SE MODIFICO EL PRECIO EN LA TABLA-----------------------------------------"
                            );

                        }
                    })
                    .error(function (error) {
                        console.log(error);
                        console.log("NO SE PUDO OBTENER EL KARDEX DE ESE PRODUCTO");
                    });
            });

            res.render("index", {
                title: "Administracion de Productos",
                fragmento: "Producto",
                lista: lista,
                msg: {
                    error: req.flash("error"),
                    info: req.flash("info")
                }
            });
        }).error(function (error) {
            req.flash("error", "Se ah producido un error al cargar la tabla");
            res.redirect("/Admin");
        });
    }
    
    /**  
     * @description Metodo para notificar si un producto se encuentra con un estock inferior a 10
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     * @return {Array} Retorna un array productos
     */
    Notifiacion(req, res) {
        var data = {};
        Producto.then(function (lista) {
            lista.forEach(function (item, index) {
                if (item.stock <= 10) {
                    data[index] = {
                        nombre: item.nombre,
                        stock: item.stock
                    };
                }
            });

            res.json(data);
        });
    }

    /**  
     * @description Metodo para guardar productos
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     */
    guardar(req, res) {
        Producto.filter({
                nombre: req.body.nombre
            })
            .then(function (productos) {
                if (productos.length <= 0) {
                    var dataP = {
                        nombre: req.body.nombre,
                        categoria: req.body.categoria,
                        descripcion: req.body.descripcion,
                        precio: req.body.precio,
                        stock: "0"
                    };
                    var producto = new Producto(dataP);
                    producto
                        .save()
                        .then(function (result) {
                            req.flash("info", "Se ha registrado correctamente el producto");
                            res.redirect("/administracion/productos");
                            console.log("se guardo con exito");
                        })
                        .error(function (error) {
                            console.log("error al guardar.");
                            req.flash(
                                "error",
                                "No se pudo registrar el producto, notifique al desarrollador de la pagina!"
                            );
                            res.redirect("/administracion/productos");
                        });
                } else {
                    console.log("ERROR AL GUARDAR YA ESTA EL PRODUCTO REGISTRADO ");
                    req.flash("error", "El producto ya se encuentra registrado!");
                    res.redirect("/administracion/productos");
                }
            })
            .error(function (error) {
                req.flash("error", "se produjo un error");
                res.redirect("/administracion/productos");
            });
    }

    /**  
     * @description Metodo para modificar un determinado producto
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     */
    modificar(req, res) {
        Producto.filter({
                id: req.body.idProducto
            })
            .then(function (productos) {
                if (productos.length > 0) {
                    var objeto = productos[0];

                    objeto.nombre = req.body.nombre2;
                    objeto.descripcion = req.body.descripcion2;
                    objeto.categoria = req.body.categoria2;
                    
                    objeto.stock = "0";
                    objeto.precio = req.body.precio2;

                    objeto
                        .save()
                        .then(function (result) {
                            req.flash("info", "Se ha modificado correctamente");
                            res.redirect("/administracion/productos");
                        })
                        .error(function (error) {
                            console.log(error);
                            req.flash("error", "No se pudo modificar");
                            res.redirect("/administracion/productos");
                        });
                } else {
                    req.flash("error", "No existe el dato a buscar");
                    res.redirect("/administracion/productos");
                }
            })
            .error(function (error) {
                req.flash("error", "Se produjo un error");
                res.redirect("/administracion/productos");
            });
    }


    /**  
     * @description Servicio para buscar un determinado producto(get) , tanto por categoria o por nombre
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     */
    buscar(req, res) {

        var criterio = req.query.criterio;
        var texto = req.query.texto;
        var data = {};
        if (criterio === 'todos') {
            Producto.then(function (lista) {
                lista.forEach(function (item, index) {
                    data[index] = {
                        id: item.id,
                        nombre: item.nombre,
                        categoria: item.categoria,
                        precio: item.precio,
                        descripcion: item.descripcion
                    };
                });
                res.json(data);

            });
            
        } else if (criterio === "categoria") {
            Producto.filter({
                categoria: texto
            }).then(function (lista) {

                lista.forEach(function (item, index) {
                    data[index] = {
                        id: item.id,
                        nombre: item.nombre,
                        categoria: item.categoria,
                        precio: item.precio,
                        descripcion: item.descripcion
                    };
                });
                res.json(data);
            }).error(function (error) {});
        } else if (criterio === "nombre") {
            Producto.filter({
                nombre: texto
            }).then(function (lista) {

                lista.forEach(function (item, index) {
                    data[index] = {
                        id: item.id,
                        nombre: item.nombre,
                        categoria: item.categoria,
                        precio: item.precio,
                        descripcion: item.descripcion
                    };
                });
                res.json(data);
            }).error(function (error) {});
        }
    }

}
module.exports = ProductoController;