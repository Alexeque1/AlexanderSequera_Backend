import { Router } from "express";
import { productsController } from "../Controllers/productsController.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsController.getProducts(req.query);
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching products' });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const response = await productsController.getProductsById(id);
    res.status(200).json(response);
});

router.get('/code/:code', async (req, res) => {
    const { code } = req.params;
    const response = await productsController.getProductsByCode(code);
    console.log(code)
    res.status(200).json(response);
});

router.post('/', async (req, res) => {
    try {
        const data = req.body
        const insertData = await productsController.addProducts(data)
        return res.json({message: "Product added", insertData})
    } catch (error) {
        return res.status(500).json('Cannot create file.')
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const data = req.body
    try {
        const putData = await productsController.updateProduct(id, data)
        const getProduct = await productsController.getProductsById(id)
        return res.json({message: putData, getProduct})
    } catch (error) {
        return res.status(500).json('Cannot create file.')
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const removeData = await productsController.removeProduct(id)
        return res.json({message: removeData})
    } catch (error) {
        return res.status(500).json('Cannot remove product.')
    }
});

export default router
