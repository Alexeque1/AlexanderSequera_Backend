import { Router } from "express";
import { chatController } from "../Controllers/chatController.js";
import { authorizeUser } from "../middlewares/Authorize.middleware.js";
import { logger } from "../Fuctions/logger.js";

const router = Router();

router.post('/', authorizeUser, async (req, res) => {
    try {
        const message = req.body;

        const chat = await chatController.addMessage(message);
        logger.info('Mensaje añadido exitosamente');
        res.status(200).json({ message: chat });

    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

export default router;
