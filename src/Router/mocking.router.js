import { Router } from "express";
import { generateProducts } from "../Fuctions/faker.js";


const router = Router();

router.get('/', async (req, res) => {
try {
        const products = [];
    
        for (let i = 0; i < 100; i++) {
            const prods = generateProducts()
            products.push(prods)
        }
    
        res.json({ products })
} catch (error) {
    logger.error(`Error en la ruta /: ${error.message}`)
    return res.status(500).json('Ha habido un error en la ruta')
}
});

export default router