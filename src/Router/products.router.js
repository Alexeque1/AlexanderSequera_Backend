import { Router } from "express";
import { productsController } from "../Controllers/productsController.js";
import { authorizeAdmin } from "../middlewares/Authorize.middleware.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const products = await productsController.getProducts(req.query);
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ error: 'An error occurred while fetching products' });
    }
});


router.get('/:id', async (req, res, next) => {
    const { id } = req.params;
    try {
        const response = await productsController.getProductsById(id);

        if (!response) {
            CustomError.generateError(ErrorsMessage.PRODUCT_NOT_FOUND, 404, ErrorsName.PRODUCT_NOT_FOUND)
        }

        res.status(200).json(response);
    } catch (error) {
        next(new Error)
    }
});

router.get('/code/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const response = await productsController.getProductsByCode(code);

        if (!response) {
            CustomError.generateError(ErrorsMessage.PRODUCT_NOT_FOUND, 404, ErrorsName.PRODUCT_NOT_FOUND)
        }

        res.status(200).json(response);
    } catch (error) {
        console.log(error)
    }
});

router.post('/', authorizeAdmin, async (req, res) => {
    try {
        const data = req.body
        const insertData = await productsController.addProducts(data)

        if (insertData === "missingData") {
            CustomError.generateError(ErrorsMessage.DATA_MISSING, 400, ErrorsName.DATA_MISSING)
        } else if (insertData === "alreadycode") {
            return res.status(400).json({message: insertData})
        }

        return res.json({message: "Product added", insertData})
    } catch (error) {
        return res.status(500).json('Cannot create file.')
    }
});

router.put('/:id', authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const data = req.body
    try {
        const putData = await productsController.updateProduct(id, data)
        const getProduct = await productsController.getProductsById(id)

        if (!getProduct) {
            CustomError.generateError(ErrorsMessage.PRODUCT_NOT_FOUND, 404, ErrorsName.PRODUCT_NOT_FOUND)
        }

        return res.json({message: putData, getProduct})
    } catch (error) {
        return res.status(500).json('Cannot create file.')
    }
});

router.delete('/:id', authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    try {
        const removeData = await productsController.removeProduct(id)
        return res.json({message: removeData})
    } catch (error) {
        return res.status(500).json('Cannot remove product.')
    }
});

export default router
