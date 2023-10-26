import { Router } from "express";
import { cartManagerInfo } from "../Dao/cartsManager.js";

const router = Router();

router.get('/', async (req, res) => {
    const cartInfo = await cartManagerInfo.getCartInfo()
    res.status(200).json({message: cartInfo})
});

router.post('/', async (req, res) => {
    const createCart = await cartManagerInfo.createCart()
    res.status(200).json({message: createCart})
});

router.get('/:id', async (req, res) => {
    const {id} = req.params 
    const getProducts = await cartManagerInfo.getCartById(id)
    res.json({message: `Products from cart ID: ${id}`, getProducts})
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartManagerInfo.updateProduct(cid, pid, quantity);
    res.json({ message: result });
  });

export default router