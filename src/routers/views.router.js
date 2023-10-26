 import { Router} from "express";
import { manager } from "../Dao/productsManager.js";

const router = Router()

router.get('/realtimeproducts', async (req, res) => {
    const products = await manager.getProducts()
    console.log({product: products})
    res.render("realtimeproducts", {products})
})

router.get('/chat', async (req, res) => {
    res.render("chat")
})

export default router