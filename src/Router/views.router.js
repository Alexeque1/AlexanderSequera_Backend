import { Router } from "express";
import { productsController } from "../Controllers/productsController.js";
import { cartsController } from "../Controllers/cartController.js";
import { authorizeUser } from "../middlewares/Authorize.middleware.js";
import { logger } from "../Fuctions/logger.js";

const router = Router();

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productsController.getProducts(req.query);

        if (req.session.user) {
            res.render("realtimeproducts", { productsResult: products.results, layout: 'mainlogin' });
        } else {
            res.render("realtimeproducts", { productsResult: products.results });
        }
    } catch (error) {
        logger.error(`Error en la ruta /realtimeproducts: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/chat', authorizeUser, async (req, res) => {
    try {
        if (req.session.user) {
            res.render("chat", { layout: 'mainlogin' });
        } else {
            res.render("chat");
        }
    } catch (error) {
        logger.error(`Error en la ruta /chat: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/cart/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await cartsController.getCartById(id);
        const productsList = result.products;

        logger.info(`Lista de productos del carrito obtenida exitosamente: ${productsList}`);

        if (req.session.user) {
            res.render("cart", { results: productsList, layout: 'mainlogin' });
        } else {
            res.render("cart", { results: productsList });
        }
    } catch (error) {
        logger.error(`Error en la ruta /cart/:id: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await productsController.getProductsById(id);
        const responseAct = [response];

        logger.info(`Producto obtenido exitosamente: ${response}`);

        if (req.session.user) {
            res.render("products", { prods: response, layout: 'mainlogin' });
        } else {
            res.render("products", { prods: responseAct });
        }
    } catch (error) {
        logger.error(`Error en la ruta /products/:id: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/login', async (req, res) => {
    try {
        if (req.session.user) {
            res.redirect("/realtimeproducts");
        } else {
            res.render("login");
        }
    } catch (error) {
        logger.error(`Error en la ruta /login: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

export default router;
