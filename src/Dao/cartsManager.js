import { existsSync, promises } from 'fs'
import { cartsModels } from './Models/carts.models.js'

class cartManager {
    constructor() {
        this.path = 'Cart.JSON'
    }

    async getCartInfo() {
        const response = await cartsModels.find()
        return response
      }
      
      async getCartById(idCart) {
        try {
          const cart = await cartsModels.findById(idCart);
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
    
    // async getProductsById(id) {
    //     try {
    //         const cartInfo = await this.getCartInfo();
    //         const index = cartInfo.findIndex(cart => cart.id === id);
    
    //         if (index === -1) {
    //             throw new Error('Cart not found');
    //         }
    
    //         const products = cartInfo[index].products;
    //         return products;
    //     } catch (error) {
    //         console.error(error);
    //         throw error;
    //     }
    // }
    
    async updateProduct(cid, productId, quantity) {
        try {
            const cart = await cartsModels.findById(cid);

            if (!cart) {
                return 'Carrito no encontrado';
            }

            console.log('Cart:', cart);

            const existingProduct = cart.products.find((product) => product.productId === productId);

            console.log('Existing Product:', existingProduct);

            if (existingProduct) {
                console.log('Updating quantity...');
                existingProduct.quantity += quantity;
                console.log('Actualizado:', existingProduct);
                await cart.save(); 
                return 'Carrito actualizado exitosamente'; 
            } else {
                console.log('Adding new product...');
                const productToAdd = {
                    productId: productId,
                    quantity: quantity
                };
                cart.products.push(productToAdd);
                await cart.save(); 
                return 'Producto agregado al carrito exitosamente';
            }

        } catch (error) {
            console.error('Error:', error);
            throw new Error(error.message);
        }
    }

}

export const cartManagerInfo = new cartManager()