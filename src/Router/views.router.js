import { Router } from "express";
import { productsController } from "../Controllers/productsController.js";
import { userController } from "../Controllers/userController.js";
import { cartsController } from "../Controllers/cartController.js";
import { authorizeAdmin, authorizeUser } from "../middlewares/Authorize.middleware.js";
import { logger } from "../Fuctions/logger.js";
import { isTokenValid } from "../Fuctions/utils.js";
import { getProfilePhoto } from "../Fuctions/utils.js";

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

router.get('/resetpassword', async (req, res) => {
    try {
        const tokenCookie = req.cookies.token;

        if (!tokenCookie) {
            return res.redirect('/login');
        }
        
        const resetToken = JSON.parse(tokenCookie);
        const createdAt = resetToken.createdAt;

        if (!isTokenValid(resetToken.token, createdAt)) {
            return res.redirect('/login');
        }

        return res.render('resetpassword', { token: resetToken.token });

    } catch (error) {
        logger.error(`Error en la ruta /login: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/profile', async (req, res) => {
    const user = req.session.user
    try {
        if (user) {
            res.render("profile", { layout: 'mainlogin' });
        } else {
            res.redirect("/realtimeproducts");
        }
    } catch (error) {
        logger.error(`Error en la ruta /login: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/profile/user/:id', authorizeAdmin, async (req, res) => {
    const {id} = req.params
    const user = req.session.user
    const userFounded = []
    try {
        if (user) {
            const finduser = await userController.findUserById(id)
            
            userFounded.push(finduser)
            userFounded[0].profilePhoto = getProfilePhoto(finduser.documents);
            
            res.render("profileUser", { userProfileResult: userFounded, layout: 'mainlogin' });
        } else {
            res.redirect("/realtimeproducts");
        }

        console.log(userFounded[0].pro)

    } catch (error) {
        logger.error(`Error en la ruta /profile/user/:id: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});



router.get('/manageusers', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.redirect("/realtimeproducts");
        }

        const userlogged = req.cookies.email;

        const users = await userController.getUserInfo();
        const usersNoAdmin = users.filter(user => user.email !== userlogged);

        for (let i = 0; i < usersNoAdmin.length; i++) {
            const user = usersNoAdmin[i];
            user.profilePhoto = getProfilePhoto(user.documents);
        }

        res.render("usersAdmin", { usersResult: usersNoAdmin, layout: 'mainlogin' });
    } catch (error) {
        logger.error(`Error en la ruta /manageusers: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

export default router;