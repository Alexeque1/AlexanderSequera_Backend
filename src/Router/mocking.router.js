import { Router } from "express";
import { generateProducts } from "../Fuctions/faker.js";


const router = Router();

router.get('/', async (req, res) => {
    const products = [];

    for (let i = 0; i < 100; i++) {
        const prods = generateProducts()
        products.push(prods)
    }

    res.json({ products })
});

export default router