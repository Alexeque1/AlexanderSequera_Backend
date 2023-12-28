import { Router} from "express";
import { productsController } from "../Controllers/productsController.js";
import { cartsController } from "../Controllers/cartController.js";
import { authorizeUser } from "../middlewares/Authorize.middleware.js";

const router = Router()

router.get('/realtimeproducts', async (req, res) => {

    const products = await productsController.getProducts(req.query);

    if (req.session.user) {
        res.render("realtimeproducts", { productsResult: products.results, layout: 'mainlogin'});
    } else {
        res.render("realtimeproducts", { productsResult: products.results });
    }

})

router.get('/chat', authorizeUser,  async (req, res) => {

    if (req.session.user) {
        res.render("chat", { layout: 'mainlogin' });
    } else {
        res.render("chat");
    }

})

router.get('/cart/:id', async (req, res) => {
    const { id } = req.params;
    const result = await cartsController.getCartById(id);
    const productsList = result.products;
      
    console.log(productsList);

    if (req.session.user) {
        res.render("cart", { results: productsList, layout: 'mainlogin' });
    } else {
        res.render("cart", { results: productsList });
    }

});

router.get('/products/:id', async (req, res) => {
    const { id } = req.params;
    const response = await productsController.getProductsById(id);
    const responseAct = [response]

    if (req.session.user) {
        res.render("products", { prods: response, layout: 'mainlogin' });
    } else {
        res.render("products", { prods: responseAct });
    }

});

router.get('/login', async (req, res) => {

    if (req.session.user) {
        res.redirect("/realtimeproducts");;
    } else {
        res.render("login");
    }

});

export default router
