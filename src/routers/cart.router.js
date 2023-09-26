import { Router } from "express";
import { cartManagerInfo } from "../cartsManager.js";

const router = Router();

router.post('/', async (req, res) => {
    const createCart = await cartManagerInfo.createCart()
    res.json({message: createCart})
});

router.get('/:id', async (req, res) => {
    const {id} = req.params 
    const getProducts = await cartManagerInfo.getProductsById(+id)
    res.json({message: `Products from cart ID: ${id}`, getProducts})
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params
    const addProducts = await cartManagerInfo.addProducts(+cid, +pid)
    res.json({addProducts})
});

export default router