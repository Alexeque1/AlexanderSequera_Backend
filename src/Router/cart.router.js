import { Router } from "express";
import { cartsController } from "../Controllers/cartController.js";

const router = Router();

router.get('/', async (req, res) => {
    const cartInfo = await cartsController.getCartInfo()
    res.status(200).json({message: cartInfo})
});

router.post('/', async (req, res) => {
    const createCart = await cartsController.createCart()
    res.status(200).json({message: createCart})
});

router.get('/:id', async (req, res) => {
    const {id} = req.params 
    const getProducts = await cartsController.getCartById(id)
    res.json({message: `Products from cart ID: ${id}`, getProducts})
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartsController.updateProduct(cid, pid, quantity);
    res.json({ message: result });
  });

  router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const result = await cartsController.deleteProduct(cid, pid);

        if (result === 'Producto eliminado del carrito exitosamente') {
            return res.status(200).json({ message: result });
        } else {
            return res.status(404).json({ message: result });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const result = await cartsController.deleteCart(cid);

        res.json({ message: result });

    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartsController.updateProduct(cid, pid, quantity);
    res.json({ message: result });
  });

export default router