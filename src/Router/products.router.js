import { Router } from "express";
import { productsController } from "../Controllers/productsController.js";
import { authorizeAdmin } from "../middlewares/Authorize.middleware.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";
import { logger } from "../Fuctions/logger.js";

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
            CustomError.generateError(ErrorsMessage.PRODUCT_NOT_FOUND, 404, ErrorsName.PRODUCT_NOT_FOUND);
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
            CustomError.generateError(ErrorsMessage.PRODUCT_NOT_FOUND, 404, ErrorsName.PRODUCT_NOT_FOUND);
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
        const user = req.user
        const insertData = await productsController.addProducts(data, user);

        if (insertData === "missingData") {
            logger.error('Datos faltantes al intentar agregar un producto');
            CustomError.generateError(ErrorsMessage.DATA_MISSING, 400, ErrorsName.DATA_MISSING);
        } else if (insertData === "alreadycode") {
            logger.error('Intento de agregar un producto con un código ya existente');
            return res.status(400).json({ message: insertData });
        } else if (insertData === "noUser") {
            logger.error('Estas intentando agregar un producto sin correo electronico');
            return res.status(400).json({ message: 'Estas intentando agregar un producto sin correo electronico', status: "noPremium" });
        } else if (insertData === "noPremium") {
            logger.error('No estás autorizado a realizar esta acción');
            return res.status(400).json({ message: 'No estás autorizado a realizar esta acción', status: "noPremium" });
        }

        logger.info('Producto agregado exitosamente');
        return res.json({ message: "Product added", satus: "ok", insertData });
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
            CustomError.generateError(ErrorsMessage.PRODUCT_NOT_FOUND, 404, ErrorsName.PRODUCT_NOT_FOUND);
        }

        logger.info(`Producto con ID ${id} actualizado exitosamente`);
        return res.status(200).json({ message: putData, getProduct });
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

router.delete('/:id', authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const user = req.user

    try {
        const findProduct = await productsController.getProductsById(id)

        if (!findProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (user.role === 'PREMIUM' && product.owner.toString() !== user.email.toString()) {
            return res.status(403).json({ message: 'No tienes permisos para eliminar este producto' });
          }

        const removeData = await productsController.removeProduct(id);

        logger.info(`Producto con ID ${id} eliminado exitosamente`);
        return res.json({ message: removeData });
    } catch (error) {
        logger.error(`Error en la ruta /: ${error.message}`);
        return res.status(500).json('Ha habido un error en la ruta');
    }
});

export default router;
