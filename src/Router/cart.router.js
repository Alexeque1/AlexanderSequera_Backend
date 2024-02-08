import { Router } from "express";
import { cartsController } from "../Controllers/cartController.js";
import { productsController } from "../Controllers/productsController.js";
import { ticketsController } from "../Controllers/ticketController.js";
import { generateRandomCode } from "../Fuctions/utils.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";
import { logger } from "../Fuctions/logger.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
      const cartInfo = await cartsController.getCartInfo()
      logger.debug('Información del carrito obtenida exitosamente: ', cartInfo);
      res.status(200).json({message: cartInfo})
    } catch (error) {
      logger.error(`Error en la ruta /: ${error.message}`)
      return res.status(500).json('Ha habido un error en la ruta')
    }
});

router.post('/', async (req, res) => {
    try {
      const createCart = await cartsController.createCart()
      logger.debug('Carrito creado exitosamente: ', createCart);
      res.status(200).json({message: createCart})
    } catch (error) {
      logger.error(`Error en la ruta /: ${error.message}`)
      return res.status(500).json('Ha habido un error en la ruta')
    }
});

router.get('/:id', async (req, res) => {
    const {id} = req.params 

    try {
      const getProducts = await cartsController.getCartById(id)
      
      if (!getProducts) {
        return res.status(404).json({ error: 'Producto no encontrado', message: "Error" });
      }
      logger.debug('Carrito por ID obtenido exitosamente', getProducts);
      res.json({message: `Products from cart ID: ${id}`, getProducts})
    } catch (error) {
      logger.error(`Error en la ruta /: ${error.message}`)
      return res.status(500).json('Ha habido un error en la ruta')
    }
});

router.post('/:cid/purchase', async (req, res) => {
  const { cid } = req.params;
  const user = req.session.user;

  try {
      let email;

      if (user) {
          logger.debug("Usuario loggeado, se avanza con el proceso");
          email = user.email;
      } else {
          logger.error("Usuario no loggeado, no se avanza");
          return res.status(401).json({ error: 'No autenticado', message: "Error" });
      }

      const cart = await cartsController.getCartById(cid);

      if (!cart) {
          logger.error("Carrito no encontrado, no se avanza");
          return res.status(404).json({ error: 'Carrito no encontrado', message: "Error" });
      }

      if (cart.products.length === 0) {
          logger.error("El carrito está vacío, no se puede realizar la compra");
          return res.status(400).json({ error: 'El carrito está vacío', message: "Error" });
      }

      let quantityOfProducts = 0;
      const ticketProducts = [];
      const productsNotPurchased = [];

      for (let i = 0; i < cart.products.length; i++) {
          const cartProduct = cart.products[i];
          const productId = cartProduct.product._id;
          const requestedQuantity = cartProduct.quantity;

          quantityOfProducts += requestedQuantity;

          const product = await productsController.getProductsById(productId);

          if (!product) {
              return res.status(404).json({ error: 'Producto no encontrado', message: "Error" });
          }

          if (product.stock >= requestedQuantity) {
              logger.debug(`Antes de restar stock del producto (${productId}):`, product.stock);
              product.stock -= requestedQuantity;

              ticketProducts.push({
                  productId: product._id,
                  price: product.price,
                  quantity: requestedQuantity,
                  productName: product.name,
              });

              await product.save();

              logger.debug(`Después de restar stock del producto (${productId}):`, product.stock);

              cart.products.splice(i, 1);
              i--; 
          } else {
              productsNotPurchased.push(productId);
              logger.warning(`Stock insuficiente para el producto (${productId})`);
          }
      }

      const generatedCode = generateRandomCode(8);

      if (productsNotPurchased.length > 0) {
          cart.products = cart.products.filter((cartProduct) => !productsNotPurchased.includes(cartProduct.product._id.toString()));
          await cart.save();

          return res.status(400).json({ error: `Stock insuficiente para los productos: ${productsNotPurchased.join(', ')}`, message: "Error" });
      }

      if (ticketProducts.length > 0) {
          const ticketAmount = ticketProducts.reduce((total, product) => total + product.quantity * product.price, 0);
          logger.info('Monto total del ticket:', ticketAmount);

          const ticketPurchaser = email;
          logger.info("Email del usuario: " + ticketPurchaser);

          await ticketsController.createTicket({
              code: generatedCode,
              amount: ticketAmount,
              purchaser: ticketPurchaser,
          });
      }

      cart.products = cart.products.filter((cartProduct) => !productsNotPurchased.includes(cartProduct.product._id.toString()));
      await cart.save();

      return res.status(200).json({ message: '¡Hecho!' });
  } catch (error) {
      logger.error(`Error en la ruta /: ${error.message}`);
      return res.status(500).json('Ha habido un error en la ruta');
  }
});

  

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
      const result = await cartsController.deleteProduct(cid, pid);

      if (result === 'Producto eliminado del carrito exitosamente') {
        return res.status(200).json({ message: result })
      } else if (result === 'Producto no encontrado en el carrito') { 
          return res.status(404).json({ message: result, status: "error" })
      } else if (result === 'Carrito no encontrado') { 
          return res.status(404).json({ message: result, status: "error" })
      }
  } catch (error) {
    logger.error(`Error en la ruta /: ${error.message}`)
    return res.status(500).json('Ha habido un error en la ruta')
  }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const result = await cartsController.deleteCart(cid);

        if (!result) {
          return res.status(404).json({message: "Carrito no encontrado", status: "error"})
        }

        res.json({ message: result });

    } catch (error) {
      logger.error(`Error en la ruta /: ${error.message}`)
      return res.status(500).json('Ha habido un error en la ruta')
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
  try {
      const { cid, pid } = req.params;
      const { quantity } = req.body;
      const userData = req.session.user;

      if (!userData) {
          return res.status(401).json({ message: 'Usuario no autenticado', status: "error" });
      }

      const productCheck = await productsController.getProductsById(pid);

      if (!productCheck) {
          return res.status(404).json({ message: 'Producto no encontrado', status: "error" });
      }

      if (userData.role === 'PREMIUM' && productCheck.owner.toString() === userData.email.toString()) {
          return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito', status: "error" });
      }

      const result = await cartsController.updateProduct(cid, pid, quantity);
      console.log("El resultado ==> " + result)

      if (!result) {
          return res.status(404).json({ message: 'Carrito no encontrado', status: "error" });
      }

      res.status(200).json({ title: "¡Hecho!", message: "El producto ha sido agregado al carrito", result: result });
  } catch (error) {
      return res.status(500).json('Ha habido un error en la ruta');
  }
});


export default router