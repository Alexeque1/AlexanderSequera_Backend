import { Router } from "express";
import { cartsController } from "../Controllers/cartController.js";
import { productsController } from "../Controllers/productsController.js";
import { ticketsController } from "../Controllers/ticketController.js";
import { generateRandomCode } from "../Fuctions/utils.js";

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

router.post('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartsController.updateProduct(cid, pid, quantity);
    res.json({ message: result });
  });

  router.post('/:cid/purchase', async (req, res) => {
    try {
      const { cid } = req.params;
      let email

      if (req.isAuthenticated()) {
            email = req.user.email
        res.json({ user: userData });
      } else {
            return res.status(401).json({ error: 'No autenticado' });
      }
      
      const cart = await cartsController.getCartById(cid);
  
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }
  
      let quantityOfProducts = 0;
      const ticketProducts = [];
      const productsNotPurchased = [];
  
      for (const cartProduct of cart.products) {
        const productId = cartProduct.product._id;
        const requestedQuantity = cartProduct.quantity;
  
        quantityOfProducts += requestedQuantity;
  
        const product = await productsController.getProductsById(productId);
  
        if (!product) {
          return res.status(404).json({ error: 'Producto no encontrado' });
        }
  
        if (product.stock >= requestedQuantity) {
          console.log(`Antes de restar stock del producto (${productId}):`, product.stock);
          product.stock -= requestedQuantity;
          await product.save();
          console.log(`Después de restar stock del producto (${productId}):`, product.stock);
  
          ticketProducts.push({
            productId: product._id,
            price: product.price,
            quantity: requestedQuantity,
            productName: product.name, 
          });
        } else {
          productsNotPurchased.push(productId);
          console.log(`Stock insuficiente para el producto (${productId})`);
        }
      }
  
      const generatedCode = generateRandomCode(8);
  
      if (productsNotPurchased.length > 0) {
        return res.status(400).json({ error: `Stock insuficiente para los productos: ${productsNotPurchased.join(', ')}` });
      }
  
      if (ticketProducts.length > 0) {
        const ticketAmount = ticketProducts.reduce((total, product) => total + product.quantity * product.price, 0);
        console.log('Monto total del ticket:', ticketAmount);
  
        const ticketPurchaser = userEmail;
        console.log("Email del usuario: " + ticketPurchaser)
  
        await ticketsController.createTicket({
          code: generatedCode,
          amount: ticketAmount,
          purchaser: ticketPurchaser,
        });
      }

  
      cart.products = cart.products.filter((cartProduct) => !productsNotPurchased.includes(cartProduct.productId.toString()));
      await cart.save();
  
      res.json({ message: 'Compra realizada con éxito' });
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
        } else {
            return res.status(404).json({ message: result });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

router.delete('/:cid', async (req, res) => {
    const { cid } = req.params;

    try {
        const result = await cartsController.deleteCart(cid);

        res.json({ message: result });

    } catch (error) {
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const result = await cartsController.updateProduct(cid, pid, quantity);
    res.json({ message: result });
  });

export default router