import { Router } from "express";
import { cartsController } from "../Controllers/cartController.js";
import { productsController } from "../Controllers/productsController.js";
import { ticketsController } from "../Controllers/ticketController.js";
import { generateRandomCode } from "../Fuctions/utils.js";
import CustomError from "../Errors/customErrors.js";
import { ErrorsMessage, ErrorsName } from "../Errors/error.enum.js";

const router = Router();

router.get('/', async (req, res) => {
    const cartInfo = await cartsController.getCartInfo()
    res.status(200).json({message: cartInfo})
});

router.post('/', async (req, res) => {
    const createCart = await cartsController.createCart()
    res.status(200).json({message: createCart})
});

router.get('/:id', async (req, res) => {
    const {id} = req.params 
    const getProducts = await cartsController.getCartById(id)
    res.json({message: `Products from cart ID: ${id}`, getProducts})
});

router.post('/:cid/purchase', async (req, res) => {
    try {
      const { cid } = req.params;
      let email;
  
      if (req.isAuthenticated()) {
        email = req.user.email;
      } else {
        return res.status(401).json({ error: 'No autenticado', message: "Error" });
      }
  
      const cart = await cartsController.getCartById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado', message: "Error" });
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
          console.log(`Antes de restar stock del producto (${productId}):`, product.stock);
          product.stock -= requestedQuantity;
      
          ticketProducts.push({
            productId: product._id,
            price: product.price,
            quantity: requestedQuantity,
            productName: product.name,
          });
      
          await product.save();
      
          console.log(`Después de restar stock del producto (${productId}):`, product.stock);
      
          // Elimina el producto del carrito, ya que se compró con éxito
          cart.products.splice(i, 1);
          i--; 
        } else {
          // Agrega el ID del producto al array de productos no comprados
          productsNotPurchased.push(productId);
          console.log(`Stock insuficiente para el producto (${productId})`);
        }
      }
  
      const generatedCode = generateRandomCode(8);
  
      if (productsNotPurchased.length > 0) {
        // Actualiza el carrito eliminando los productos comprados
        cart.products = cart.products.filter((cartProduct) => !productsNotPurchased.includes(cartProduct.product._id.toString()));
        await cart.save();
  
        return res.status(400).json({ error: `Stock insuficiente para los productos: ${productsNotPurchased.join(', ')}`, message: "Error" });
      }
  
      if (ticketProducts.length > 0) {
        const ticketAmount = ticketProducts.reduce((total, product) => total + product.quantity * product.price, 0);
        console.log('Monto total del ticket:', ticketAmount);
  
        const ticketPurchaser = email;
        console.log("Email del usuario: " + ticketPurchaser);
  
        await ticketsController.createTicket({
          code: generatedCode,
          amount: ticketAmount,
          purchaser: ticketPurchaser,
        });
      }
  
      // Actualiza el carrito eliminando los productos comprados
      cart.products = cart.products.filter((cartProduct) => !productsNotPurchased.includes(cartProduct.product._id.toString()));
      await cart.save();
  
      return res.json({ message: '¡Hecho!' });
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const result = await cartsController.deleteProduct(cid, pid);

        if (result === 'Producto eliminado del carrito exitosamente') {
            return res.status(200).json({ message: result });
        } else if (result === "Carrito no encontrado") {
            CustomError.generateError(result, 404, ErrorsName.CART_NOT_FOUND);
        } else {
            CustomError.generateError(result, 404, ErrorsName.PRODUCT_NOT_FOUND);
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const result = await cartsController.deleteCart(cid);

        if (!result) {
            CustomError.generateError(ErrorsMessage.CART_NOT_FOUND, 404, ErrorsName.CART_NOT_FOUND)
        }

        res.json({ message: result });

    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartsController.updateProduct(cid, pid, quantity);

    if (!result) {
        CustomError.generateError(ErrorsMessage.CART_NOT_FOUND, 404, ErrorsName.CART_NOT_FOUND)
    }

    res.json({ title: "¡Hecho!",  message: "El producto ha sido agregado al carrito", result: result});
  });

export default router