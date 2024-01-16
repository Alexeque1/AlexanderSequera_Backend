import { cartDao } from "../Dao/Mongo/cartsDao.mongo.js";

class CartsController {
  async getCartInfo() {
    try {
      const response = await cartDao.getCartInfo();
      return response;
    } catch (error) {
      logger.error(`Error en Controller (getCartInfo): ${error.message}`);
      throw new Error(`Error en el controlador al obtener información del carrito: ${error.message}`);
    }
  }

  async getCartById(idCart) {
    try {
      const cart = await cartDao.getCartById(idCart);
      return cart;
    } catch (error) {
      logger.error(`Error en Controller (getCartById): ${error.message}`);
      throw new Error(`Error en el controlador al obtener el carrito por ID: ${error.message}`);
    }
  }

  async createCart() {
    try {
      const newCart = await cartDao.createCart();
      return newCart;
    } catch (error) {
      logger.error(`Error en Controller (createCart): ${error.message}`);
      throw new Error(`Error en el controlador al crear un nuevo carrito: ${error.message}`);
    }
  }

  async updateProduct(cartId, productId, quantity) {
    try {
      const result = await cartDao.updateProduct(cartId, productId, quantity);
      return result;
    } catch (error) {
      logger.error(`Error en Controller (updateProduct): ${error.message}`);
      throw new Error(`Error en el controlador al actualizar el producto en el carrito: ${error.message}`);
    }
  }

  async deleteProduct(cartId, productId) {
    try {
      const result = await cartDao.deleteProduct(cartId, productId);
      return result;
    } catch (error) {
      logger.error(`Error en Controller (deleteProduct): ${error.message}`);
      throw new Error(`Error en el controlador al eliminar el producto del carrito: ${error.message}`);
    }
  }

  async deleteCart(cartId) {
    try {
      const result = await cartDao.deleteCart(cartId);
      return result;
    } catch (error) {
      logger.error(`Error en Controller (deleteCart): ${error.message}`);
      throw new Error(`Error en el controlador al eliminar el carrito: ${error.message}`);
    }
  }

  async updateQuantity(cartId, productId, quantityAct) {
    try {
      const result = await cartDao.updateQuantity(cartId, productId, quantityAct);
      return result;
    } catch (error) {
      logger.error(`Error en Controller (updateQuantity): ${error.message}`);
      throw new Error(`Error en el controlador al actualizar la cantidad en el carrito: ${error.message}`);
    }
  }
}

export const cartsController = new CartsController();
