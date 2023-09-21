import express from 'express';
import { manager } from './products.js';

const app = express();

app.use(express.urlencoded({extended:true}))

app.get('/products', async (req, res) => {
    const {limit} = req.query

    if (!limit) {
        const products = await manager.getProducts();
        return res.json(products);
    } else {
        const filter = await manager.getProductsByQuant(+limit)
        return res.json(filter)
    }
});

app.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const response = await manager.getProductsById(+id);
    res.json(response);
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
