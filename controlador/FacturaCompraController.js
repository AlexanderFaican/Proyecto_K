'use strict';

var r = require('rethinkdb');

var facturaCompra = require('../modelos/facturaCompra');
var detalleCompra = require('../modelos/detallecompra');
var empresa = require('../modelos/empresa');
var producto = require('../modelos/producto');
var kardex = require('../modelos/kardex');

/** 
 * @class FacturaCompraController
 */
class FacturaCompraController {
   
    
    /**
     * @description Metodo para consultar numero de registros en la tabla FacturaCompra
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en Front end
     * @returns {Number} Retorna el numero de registros totales
     */
    
    buscarC(req, res) {
        var data = {};
        facturaCompra.then(function (lista) {
            var nro = lista.length + 1;

            data[0] = {
                nro: nro
            };

            res.json(data);
        });
    }

    /**
     * @description Metodo para visualizar el fragmento registrarCompra.hbs, mandando las empresas y productos registrados en la BD
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en Front end
     * 
     */
    registrarCompra(req, res) {
        let d = {
            title: 'Registrar Compra',
            fragmento: 'registrarCompra',
            empresas: null,
            productos: null,
            error: {
                status: false,
                message: ''
            }
        };
        empresa.then(function (empresas) {
            producto.then(function (productos) {
                d.empresas = empresas;
                d.productos = productos;
                res.render('index', d);
            }).catch(function (error) {
                d.error.status = true;
                d.error.message = 'Ocurrió un error al obtener la información de los productos disponibles';
                res.render('index', d);
            });
        }).catch(function (error) {
            d.error.status = true;
            d.error.message = 'Ocurrió un error al obtener la información de las empresas';
            res.render('index', d);
        });
    }

    /**
     * @description Metodo para guardar una factura de Compra, relacionando con la Empresa
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en Front end
     */ 
    guardarCompraBeta(req, res) {
        let factura = JSON.parse(req.body.factura);
        let factura_compra = new facturaCompra({
            id_empresa: factura.id_empresa,
            nro_factura: factura.nro_factura,
            subtotal: factura.subtotal,
            iva: factura.iva,
            total: factura.total
        });

        let lista_detalleCompra = [];
       
        factura.items_detalle_compra.forEach(function (item) {
            let detalle_compra = new detalleCompra({
                id_producto: item.id_producto,
                cantidad: item.cantidad,
                valor_unitario: item.valor_unitario,
                valor_total: item.valor_total
            });
            let asiento = require('../modelos/asientoContable');
            var datos = {
                id_producto: item.id_producto,
                descripcion: "Compra",
                referencia: factura.nro_factura,
                cantidad: item.cantidad,
                valor_unitario: item.valor_unitario,
                monto: item.valor_total
            };
            var asient = new asiento(datos);
           
            asient.save().then(function (result) {
                console.log("LO QUE SE GUARDO DE L ASIENTO --------------------------------++++" + result);
            }).error(function (error) {
                console.log("-------------ERORR ASIENTO");
            });
            
            detalle_compra.facturaCompra = factura_compra;
            console.log("++++++++++++++++++++++++++++++++++++++++++++++++++++++");
            console.log(item);
            lista_detalleCompra.push(detalle_compra);
        });
        factura_compra.detallecompra = lista_detalleCompra;
 
        factura_compra.saveAll({detallecompra: true}).then(function (result) {
            console.log(result);
            saveKardexItemsRecursivo(result, 0, function (code, data) {
                res.json({data: 'Factura guarda con éxito', method: {code: code, data: data}});
            });
            
        }).catch(function (error) {
            console.log(error);
            res.json({data: 'Error al guardar la factura'});
        });
    }

}

/**
 * 
 * @param {Number} num Requerido para operar con el mismo
 * @returns {Number} Retorna el redondeo de un numero 
 */
function redondear2Decimales(num) {
    return Math.round(num * 100) / 100;
}

/**
 * @description Metodo recursivo para guarda cada item de la factura
 * @param {Object} Array Lista de productos agregados a la tabla de la Factura Compra
 * @param {Number} pos El valor por defecto es cero, utilizado para metodo recursivo
 * @param {String} callback Mensajes de respuesta por si ocurre uun error
 */
function saveKardexItemsRecursivo(factura, pos, callback) {
    let size = factura.detallecompra.length;
    console.log('size ' + size);
    console.log('pos ' + pos);
    if (pos < size) {
        let item = factura.detallecompra[pos];
        producto.get(item.id_producto).then(function (p) {
           
            producto.get(p.id).update({stock: p.stock + item.cantidad}).then(function (producto_updated) {
                kardex.filter({id_producto: item.id_producto}).orderBy('createdAt').then(function (lista_kardex) {
                    let ultimo_kardex;
                    let new_kardex = {
                        id_factura: item.id_facturaC,
                        id_producto: item.id_producto,
                        tipo: 0,
                        descripcion: 'Factura de compra Nro ' + factura.nro_factura,
                        es_cantidad: item.cantidad,
                        es_valor_unitario: item.valor_unitario,
                        es_valor_total: item.valor_total,
                        e_cantidad: 0,
                        e_valor_unitario: 0,
                        e_valor_total: 0
                    };
                    if (lista_kardex.length > 0) {
                       
                        ultimo_kardex = lista_kardex[lista_kardex.length - 1];
                        new_kardex.e_cantidad = ultimo_kardex.e_cantidad + item.cantidad;
                        new_kardex.e_valor_total = redondear2Decimales(ultimo_kardex.e_valor_total + item.valor_total);
                        new_kardex.e_valor_unitario = Math.round((new_kardex.e_valor_total / new_kardex.e_cantidad) * 100) / 100;
                    } else {
                        new_kardex.e_cantidad = item.cantidad;
                        new_kardex.e_valor_unitario = item.valor_unitario;
                        new_kardex.e_valor_total = item.valor_total;
                    }
                    let krd = new kardex(new_kardex);
                   
                    krd.producto = producto_updated;
                    krd.saveAll().then(function (result) {
                          
                        pos = pos + 1;
                        saveKardexItemsRecursivo(factura, pos, callback);
                    }).catch(function (error) {
                        console.log(error);
                        callback(-1, 'Error al guardar el kardex');
                    });
                }).catch(function (error) {
                    console.log(error);
                    callback(-1, 'Error al filtrar el kardex por fecha');
                });
            }).catch(function () {
               
                callback(-1, 'Error al actualizar el stock del producto');
            });
        }).catch(function (error) {
            console.log(error);
            callback(-1, 'Error al obtener la información del producto');
        });
    } else {
        callback(0, 'Kardex actualizado');
    }
}

module.exports = FacturaCompraController;