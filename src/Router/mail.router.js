import { Router } from "express";
import { transport } from "../app.js";
import { client } from "../Fuctions/twilio.js";
import { userController } from "../Controllers/userController.js";
import { hashData } from "../app.js";
import config from "../config.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";
import { logger } from "../Fuctions/logger.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        let mailOptions = {
            from: 'AlexBackend <alexandersequera97@gmail.com>',
            to: 'alexandersequera97@gmail.com',
            subject: "Prueba nodemailer",
            text: 'Primera prueba de nodemailer - Gmail'
        };

        await transport.sendMail(mailOptions);
        logger.info('Mail enviado exitosamente');
        res.send('Mail enviado');
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

/// FORGOT PASSWORD
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email, password } = req.body;

        const findUser = await userController.findByEmail(email);

        if (!findUser) {
            logger.error(`Usuario no encontrado para el email: ${email}`);
            CustomError.generateError(ErrorsMessage.USER_NOT_FOUND, 404, ErrorsName.USER_NOT_FOUND);
        }

        const hashPassword = await hashData(password);

        findUser.password = hashPassword;
        await findUser.save();

        let mailOptions = {
            from: 'AlexBackend <alexandersequera97@gmail.com>',
            to: email,
            subject: "Olvidé mi contraseña",
            text: 'Su contraseña ha sido actualizada'
        };

        await transport.sendMail(mailOptions);
        logger.info('Contraseña actualizada y correo enviado exitosamente');
        return res.send({ message: '¡Hecho!' });
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

// TWILIO
router.get('/twilio', async (req, res) => {
    try {
        const options = {
            body: "TWILIO MSN",
            to: "whatsapp:+5491123536589",
            from: config.twilio_phone
        };

        await client.messages.create(options);
        logger.info('Mensaje de Twilio enviado exitosamente');
        res.send('Mensaje enviado');
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

export default router;
