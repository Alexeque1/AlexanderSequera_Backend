import { cartsModels } from '../Models/carts.models.js'
import { productDao } from './productsDao.js'

class cartsDao {

    async getCartInfo() {
        const response = await cartsModels.find()
        return response
      }
      
      async getCartById(idCart) {
        try {
          const cart = await cartsModels.findById(idCart).populate('products.product');
          return cart;
        } catch (error) {
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
          throw new Error(error.message);
        }
      }
    
  async updateProduct(cid, productId, quantity) {
    try {
      const cart = await cartsModels.findById(cid);

      if (!cart) {
        return 'Carrito no encontrado';
      }

      console.log('Cart:', cart);

      const existingProduct = cart.products.find(
        (product) => product.product.equals(productId)
      );

      console.log('Existing Product:', existingProduct);

      if (existingProduct) {
        console.log('Updating quantity...');
        existingProduct.quantity += quantity;
        console.log('Actualizado:', existingProduct);
      } else {
        console.log('Adding new product...');
        const productToAdd = {
          product: productId,
          quantity: quantity,
        };
        cart.products.push(productToAdd);
      }

      // Guarda los cambios en el carrito
      await cart.save();

      return 'Carrito actualizado exitosamente';
    } catch (error) {
      console.error('Error:', error);
      throw new Error(error.message);
    }
  }

    async deleteProduct(cartID, prodID) {
      try {
        const cart = await this.getCartById(cartID);

        if (!cart) {
            return 'Carrito no encontrado';
        }

        const productIndex = cart.products.findIndex((product) => product.productId === prodID);

        if (productIndex === -1) {
            return 'Producto no encontrado en el carrito';
        }

        cart.products.splice(productIndex, 1); 
        await cart.save();

        return 'Producto eliminado del carrito exitosamente';

      } catch (error) {
          console.error('Error:', error);
          throw new Error(error.message);
      }
  }

  async deleteCart(cartID) {
    try {
      const cart = await this.getCartById(cartID);

      if (!cart) {
          return 'Carrito no encontrado';
      }

      const result = await cartsModels.deleteOne({ _id: cartID });

      return {'Carrito eliminado exitosamente:': result};

    } catch (error) {
        console.error('Error:', error);
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
      console.error('Error:', error);
      throw new Error(error.message);
    }
  }

}

export const cartDao = new cartsDao()