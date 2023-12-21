import { Router } from "express";
import { transport } from "../app.js";

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

export default router