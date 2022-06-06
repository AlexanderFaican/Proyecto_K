'use strict';

var Producto = require('../modelos/producto');

/** 
 * @class VentaController
 */
class VentaController {

    /**  
     * @description Metodo para enviar la lista de productos registrados en la BD
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     * @return Retornamos la vista de venderProductos.hbs
     */
    visualizar(req, res) {
        Producto.then(function (lista) {
            console.log(lista);

             res.render('index', {title: 'Venta Productos', fragmento: 'venderProductos' , lista:lista});
        }).error(function (error) {
            res.redirect('/usuario');
          
        });
    }
    
    
}
module.exports = VentaController;

