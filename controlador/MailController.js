'use stritc';

var nodemailer = require('nodemailer');

/** 
 * @class MailController
 */
class MailController {
    /**  
     * @description Metodo de comunicacion entre el usuario y los desarrolladores
     * @param {req} req  Para tratar los datos del Back end
     * @param {res} res  Para presentar los datos en  Front end
     */
    enviar(req, res) {
        var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: 'servidor.kardex@gmail.com', //preguntar que va aqui
                pass: 'universidadloja'
            }
        });

        var mailOptions = {
            
            from: req.body.nombre,
            to: ["dannyvas15@gmail.com", "alexis.quizhpe@gmail.com", "jaramillojumbo@gmail.com"],
            subject: req.body.asunto,
            text: req.body.message
        };

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                req.flash('error', 'Hubo un error al enviar el correo.');
                res.redirect('/');
            } else {
                req.flash('info', 'El correo ha sido enviado.');
                res.redirect('/');
            }
        });

    }
}

module.exports = MailController;