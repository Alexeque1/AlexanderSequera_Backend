import { cartsModels } from '../../Models/carts.models.js'
import { productDao } from './productsDao.mongo.js';
import { productsController } from '../../Controllers/productsController.js';
import { logger } from '../../Fuctions/logger.js';

class cartsDao {

    async getCartInfo() {
        try {
          const response = await cartsModels.find()
          return response
        } catch (error) {
          logger.error("Hubo un error en DAO")
          throw new Error(error.message);
        }
      }
      
      async getCartById(idCart) {
        try {
          const cart = await cartsModels.findById(idCart).populate('products.product');
          return cart;
        } catch (error) {
          logger.error("Hubo un error en DAO")
          throw new Error(error.message);
        }
      }

      async createCart() {
        try {
          const newCart = await cartsModels.create({
            products: [] 
          });
      
          return newCart;
        } catch (error) {
          logger.error("Hubo un error en DAO")
          throw new Error(error.message);
        }
      }
    
      async updateProduct(cid, productId, quantity) {
        try {
            const cart = await cartsModels.findById(cid);
    
            if (!cart) {
                return false;
            }
    
            const product = await productsController.getProductsById(productId);
    
            if (!product) {
                throw new Error('Producto no encontrado');
            }
    
            const existingProduct = cart.products.find(
                (product) => product.product.equals(productId)
            );
    
            if (existingProduct) {
                // Verifica si hay suficiente stock disponible para agregar al carrito
                if (product.stock >= quantity) {
                    existingProduct.quantity += quantity;
                } else {
                    throw new Error('Stock insuficiente para agregar al carrito');
                }
            } else {
                if (product.stock >= quantity) {
                    const productToAdd = {
                        product: productId,
                        quantity: quantity,
                    };
                    cart.products.push(productToAdd);
                } else {
                    throw new Error('Stock insuficiente para agregar al carrito');
                }
            }
    
            product.stock -= quantity;
            await product.save();
            await cart.save();
    
            return 'Carrito actualizado exitosamente';
        } catch (error) {
            logger.error('Hubo un error en DAO', error);
            throw new Error(error.message);
        }
    }    

    async deleteProduct(cartID, prodID) {
      try {
        const cart = await this.getCartById(cartID);
    
        if (!cart) {
          return 'Carrito no encontrado';
        }
    
        const productIndex = cart.products.findIndex(item => item.product._id.toString() === prodID);
    
        if (productIndex === -1) {
          return 'Producto no encontrado en el carrito';
        }
    
        cart.products.splice(productIndex, 1);
        await cart.save();
    
        return 'Producto eliminado del carrito exitosamente';
      } catch (error) {
        logger.error("Hubo un error en DAO:", error);
        throw new Error(error.message);
      }
    };

  async deleteCart(cartID) {
    try {
      const cart = await this.getCartById(cartID);

      if (!cart) {
          return false;
      }

      const result = await cartsModels.deleteOne({ _id: cartID });

      return {'Carrito eliminado exitosamente:': result};

    } catch (error) {
      logger.error("Hubo un error en DAO")
      throw new Error(error.message);
    }
}

  async updateQuantity(cartID, prodID, quantityAct) {
    try {
      const cart = await this.getCartById(cartID);

      if (!cart) {
        return 'Carrito no encontrado';
      }

      const product = await productDao.getProductsById(prodID)

      if (!product) {
        return 'Producto no encontrado';
      }

      const existingProduct = cart.products.find((prod) => prod.product === prodID);

      if (!existingProduct) {
        return 'Producto no encontrado';
      } else {
        existingProduct.quantity += quantityAct;
        await cart.save();
        return 'Carrito actualizado exitosamente';
      }

    } catch (error) {
      logger.error("Hubo un error en DAO")
      throw new Error(error.message);
    }
  }

}

export const cartDao = new cartsDao()