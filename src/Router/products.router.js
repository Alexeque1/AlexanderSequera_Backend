import { Router } from "express";
import { productsController } from "../Controllers/productsController.js";
import { authorizeAdmin } from "../middlewares/Authorize.middleware.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";
import { logger } from "../Fuctions/logger.js";
import { userController } from "../Controllers/userController.js";
import { transport } from "../app.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsController.getProducts(req.query);
        logger.info('Productos obtenidos exitosamente');
        return res.status(200).json({ products });
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await productsController.getProductsById(id);

        if (!response) {
            logger.error(`Producto no encontrado con ID: ${id}`);
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        logger.info(`Producto con ID ${id} obtenido exitosamente`);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.get('/code/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const response = await productsController.getProductsByCode(code);

        if (!response) {
            logger.error(`Producto no encontrado con código: ${code}`);
            return res.status(404).json({ error: 'Producto no encontrado' });
        }

        logger.info(`Producto con código ${code} obtenido exitosamente`);
        res.status(200).json(response);
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.post('/', authorizeAdmin, async (req, res) => {
    try {
        const data = req.body;
        const user = req.session.user
        const insertData = await productsController.addProducts(data, user);

        if (insertData === "missingData") {
            logger.error('Datos faltantes al intentar agregar un producto');
            CustomError.generateError(ErrorsMessage.DATA_MISSING, 400, ErrorsName.DATA_MISSING);
        } else if (insertData === "alreadycode") {
            logger.error('Intento de agregar un producto con un código ya existente');
            return res.status(400).json({ message: insertData, status: "noCode" });
        } else if (insertData === "noUser") {
            logger.error('Estas intentando agregar un producto sin correo electronico');
            return res.status(400).json({ message: 'Estas intentando agregar un producto sin correo electronico', status: "noPremium" });
        } else if (insertData === "noPremium") {
            logger.error('No estás autorizado a realizar esta acción');
            return res.status(400).json({ message: 'No estás autorizado a realizar esta acción', status: "noPremium" });
        }

        logger.info('Producto agregado exitosamente');
        return res.json({ message: "Product added", status: "ok", insertData });
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.put('/:id', authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        const putData = await productsController.updateProduct(id, data);
        const getProduct = await productsController.getProductsById(id);

        if (!getProduct) {
            logger.error(`Producto no encontrado con ID: ${id} al intentar actualizar`);
            return res.status(400).json({ message: 'Producto no encontrado con ID: ${id} al intentar actualizar', status: "noProduct" });
        }

        logger.info(`Producto con ID ${id} actualizado exitosamente`);
        return res.status(200).json({ message: putData, getProduct });
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const findProduct = await productsController.getProductsById(id)

        if (!findProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        let removeData
        const userOwner = findProduct.owner
        const findUser = await userController.findByEmail(userOwner)
        const userRole = findUser.role
        
        if(!findUser) {
            removeData = await productsController.removeProduct(id);
            return "done"
        } else if (userRole == "PREMIUM") {
            let mailOptions = {
                from: 'AlexBackend <alexandersequera97@gmail.com>',
                to: findUser.email,
                subject: "Restaurar contraseña",
                html: `
                    <html>
                        <head>
                            <style>
                                body {
                                    font-family: 'Arial', sans-serif;
                                    background-color: #f4f4f4;
                                    color: #333;
                                    margin: 0; 
                                    padding: 0; 
                                }
                                header {
                                    background-color: #007bff;
                                    padding: 20px;
                                    color: #fff;
                                    text-align: center;
                                    width: 100%; 
                                }
                                main {
                                    max-width: 600px; 
                                    margin: 20px auto; 
                                }
                                button {
                                    background-color: rgb(191, 184, 184);
                                    padding: 10px;
                                    font-family: 'Saira Stencil One', cursive;
                                    font-size: 1em;
                                    border-radius: 10px;
                                    cursor: pointer;
                                    text-align: center;
                                    display: block; 
                                    margin: 10px auto; 
                                }
                                footer {
                                    background-color: #f4f4f4;
                                    padding: 10px;
                                    text-align: center;
                                    font-size: 12px;
                                    width: 100%; 
                                }
                            </style>
                        </head>
                        <body>
                            <header>
                                <h1>Funko Pop - Eliminación de la cuenta</h1>
                            </header>
                            <main>
                                <p>¡Hola, <b>${findUser.first_name}<b>!</p>
                                <p>El producto ${findProduct.title} ha sido eliminado.</p>
                                <p>Gracias por utilizar nuestros servicios.</p>
                            </main>
                            <footer>
                                <p>Este es un mensaje automático. Por favor, no responda a este correo electrónico.</p>
                                <p>&copy; 2024 Funko Pop Argentina</p>
                            </footer>
                        </body>
                    </html>
                `
            };
            
            await transport.sendMail(mailOptions);

            removeData = await productsController.removeProduct(id);
        }

        logger.info(`Producto con ID ${id} eliminado exitosamente`);
        return res.json({ message: removeData });
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

export default router;
