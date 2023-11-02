import { Router } from "express";
import { chatManagerInfo } from "../Dao/chatManager.js";

const router = Router();

router.post('/', async (req, res) => {
    const message = req.body

    const createCart = await chatManagerInfo.addMessage(message)
    res.status(200).json({message: createCart})
});

export default router