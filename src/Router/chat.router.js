import { Router } from "express";
import { chatController } from "../Controllers/chatController.js";
import { authorizeUser } from "../middlewares/Authorize.middleware.js";

const router = Router();

router.post('/', authorizeUser, async (req, res) => {
    const message = req.body

    const chat = await chatController.addMessage(message)
    res.status(200).json({message: chat})
});

export default router