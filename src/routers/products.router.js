import { Router } from "express";
import { manager } from "../Dao/productsManager.js";

const router = Router();

router.get('/', async (req, res) => {
    const {limit} = req.query

    try {
        if (!limit) {
            const products = await manager.getProducts();
            return res.status(200).json({products});
        } else {
            const filter = await manager.getProductsByQuant(+limit)
            return res.status(200).json(filter)
        }
    } catch (error) {
        return res.status(500).json('Products not found')
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const response = await manager.getProductsById(id);
    res.status(200).json(response);
});

router.get('/code/:code', async (req, res) => {
    const { code } = req.params;
    const response = await manager.getProductsByCode(code);
    console.log(code)
    res.status(200).json(response);
});

router.post('/', async (req, res) => {
    try {
        const data = req.body
        const insertData = await manager.addProducts(data)
        return res.json({message: "Product added", insertData})
    } catch (error) {
        return res.status(500).json('Cannot create file.')
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body
    try {
        const putData = await manager.updateProduct(id, data)
        const getProduct = await manager.getProductsById(id)
        return res.json({message: putData, getProduct})
    } catch (error) {
        return res.status(500).json('Cannot create file.')
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const removeData = await manager.removeProduct(id)
        return res.json({message: removeData})
    } catch (error) {
        return res.status(500).json('Cannot remove product.')
    }
});

export default router
