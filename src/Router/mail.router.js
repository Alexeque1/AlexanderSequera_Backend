import { Router } from "express";
import { transport } from "../app.js";
import { client } from "../Fuctions/twilio.js";
import { userController } from "../Controllers/userController.js";
import { hashData } from "../app.js";
import config from "../config.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";
import { logger } from "../Fuctions/logger.js";
import { generateToken } from "../Fuctions/jwt.js";

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
        const { email } = req.body;

        const findUser = await userController.findByEmail(email);

        if (!findUser) {
            logger.error(`Usuario no encontrado para el email: ${email}`);
            CustomError.generateError(ErrorsMessage.USER_NOT_FOUND, 404, ErrorsName.USER_NOT_FOUND);
        }

        const userName = findUser.first_name
        const token = generateToken({findUser});

        const tokenOptions = {
            token: token,
            user: findUser._id,
            createdAt: new Date(),
        };

        const cookieOptions = {
            httpOnly: true,
            secure: config.enviroment === 'production',
            maxAge: 3600000, 
        };

        const resetLink = `http://localhost:8080/resetpassword`

        res.cookie('token', JSON.stringify(tokenOptions), cookieOptions);

        let mailOptions = {
            from: 'AlexBackend <alexandersequera97@gmail.com>',
            to: email,
            subject: "Restaurar contraseña",
            html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                color: #333;
                                margin: 0; 
                                padding: 0; 
                            }
                            header {
                                background-color: #007bff;
                                padding: 20px;
                                color: #fff;
                                text-align: center;
                                width: 100%; 
                            }
                            main {
                                max-width: 600px; 
                                margin: 20px auto; 
                            }
                            button {
                                background-color: rgb(191, 184, 184);
                                padding: 10px;
                                font-family: 'Saira Stencil One', cursive;
                                font-size: 1em;
                                border-radius: 10px;
                                cursor: pointer;
                                text-align: center;
                                display: block; 
                                margin: 10px auto; 
                            }
                            footer {
                                background-color: #f4f4f4;
                                padding: 10px;
                                text-align: center;
                                font-size: 12px;
                                width: 100%; 
                            }
                        </style>
                    </head>
                    <body>
                        <header>
                            <h1>Funko Pop - Restauración de Contraseña</h1>
                        </header>
                        <main>
                            <p>¡Hola, <b>${userName}<b>!</p>
                            <p>Hemos recibido una solicitud de restauración de contraseña. Puedes hacer clic en el siguiente botón para continuar con el proceso.</p>
                            <button>
                                <a href=${resetLink}>Restaurar contraseña</a>
                            </button>
                            <p>Gracias por utilizar nuestros servicios.</p>
                        </main>
                        <footer>
                            <p>Este es un mensaje automático. Por favor, no responda a este correo electrónico.</p>
                            <p>&copy; 2024 Funko Pop Argentina</p>
                        </footer>
                    </body>
                </html>
            `
        };
        
        await transport.sendMail(mailOptions);
        

        logger.info('Correo enviado exitosamente');
        return res.status(200).send({ message: '¡Hecho!' });
    } catch (error) {
        logger.error(`Error en la ruta: ${error.message}`);
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
