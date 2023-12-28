import { Router } from "express";
import { transport } from "../app.js";
import { client } from "../Fuctions/twilio.js";
import { userController } from "../Controllers/userController.js";
import { hashData } from "../app.js";
import config from "../config.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";

const router = Router();

router.get('/', async (req, res) => {
    let mailOptions = {
        from: 'AlexBackend <alexandersequera97@gmail.com>',
        to:'alexandersequera97@gmail.com',
        subject: "Prueba nodemailer",
        text: 'Primera prueba de nodemailer - Gmail'
    };

    await transport.sendMail(mailOptions)
    res.send('Mail enviado')
});

/// FORGOT PASSWORD
router.post('/forgotpassword', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(email);
        console.log(password);

        const findUser = await userController.findByEmail(email);

        if (!findUser) {
            CustomError.generateError(ErrorsMessage.USER_NOT_FOUND, 404, ErrorsName.USER_NOT_FOUND)
        }

        const hashPassword = await hashData(password);
        console.log(hashPassword);

        findUser.password = hashPassword;
        await findUser.save();

        let mailOptions = {
            from: 'AlexBackend <alexandersequera97@gmail.com>',
            to: email,
            subject: "Olvidé mi contraseña",
            text: 'Su contraseña ha sido actualizada'
        };
    
        await transport.sendMail(mailOptions);
        return res.send({ message: '¡Hecho!' });
    } catch (error) {
        console.error(error);
        return res.status(500).json('Cannot send email.');
    }
});


// TWILIO
router.get('/twilio', async (req, res) => {
    const options = {
        body: "TWILIO MSN",
        to: "whatsapp:+5491123536589",
        from: config.twilio_phone
    }

    await client.messages.create(options)
    res.send('Mensaje enviado')
});

export default router