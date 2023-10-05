 import { Router} from "express";
 import { manager } from "../productsManager.js";

const router = Router()

router.get('/', async (req, res) => {
    const product = await manager.getProducts()
    console.log(product)
    res.render("home", {product: product})
})

router.get('/realtimeproducts', async (req, res) => {
    const product = await manager.getProducts()
    console.log(product)
    res.render("realtimeproducts", {product: product})
})

export default router