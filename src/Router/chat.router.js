import { Router } from "express";
import { chatController } from "../Controllers/chatController.js";

const router = Router();

router.post('/', async (req, res) => {
    const message = req.body

    const createCart = await chatController.addMessage(message)
    res.status(200).json({message: createCart})
});

export default router