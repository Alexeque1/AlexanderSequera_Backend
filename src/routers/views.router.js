 import { Router} from "express";
import { manager } from "../Dao/productsManager.js";
import { cartManagerInfo } from "../Dao/cartsManager.js";

const router = Router()

router.get('/realtimeproducts', async (req, res) => {
    const products = await manager.getProducts(req.query)
    console.log(products)
    res.render("realtimeproducts", {productsResult: products.results})
})

router.get('/chat', async (req, res) => {
    res.render("chat")
})

router.get('/cart/:id', async (req, res) => {
    const { id } = req.params;
    const result = await cartManagerInfo.getCartById(id);
    const productsList = result.products;
    console.log(productsList)
    res.render("cart", { results: productsList });
});

export default router
