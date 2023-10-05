import { existsSync, promises } from 'fs'
import { manager } from './productsManager.js'

class cartManager {
    constructor() {
        this.path = 'Cart.JSON'
    }

    async getCartInfo() {
        try {
            if (existsSync(this.path)) {
                const cartInfo = await promises.readFile(this.path, 'utf-8')
                console.log(cartInfo)
                return JSON.parse(cartInfo)
            } else {
                return []
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async getCartById(idCart) {
        try {
            const productsAr = await this.getCartInfo()
            const producto = productsAr.find(prod => prod.id === idCart)
    
            if (!producto) {
                console.log('Not found')
                return 'Not found'
            } else {
                return producto
            }
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async createCart() {
        try {
            const cartInfo = await this.getCartInfo();
            let id;
    
            if (!cartInfo.length) {
                id = 1;
            } else {
                id = cartInfo[cartInfo.length - 1].id + 1;
            }
    
            const newCart = {
                id: id,
                products: []
            }
    
            cartInfo.push(newCart);
            await promises.writeFile(this.path, JSON.stringify(cartInfo), 'utf-8');
    
            return 'Cart created';
    
        } catch (error) {
            console.error(error); 
            throw error;
        }
    }
    
    async getProductsById(id) {
        try {
            const cartInfo = await this.getCartInfo();
            const index = cartInfo.findIndex(cart => cart.id === id);
    
            if (index === -1) {
                throw new Error('Cart not found');
            }
    
            const products = cartInfo[index].products;
            return products;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
    
    async addProducts(idCart, idProd) {
        try {
            const getCart = await this.getCartById(idCart);
            let index;
            const getFullCart = await this.getCartInfo();
    
            if (getCart === 'Not found') {
                return `Cart with ID ${idCart} doesn't exist`;
            } else {
                index = getFullCart.findIndex((cart) => cart.id === idCart);
            }
    
            const getProduct = await manager.getProductsById(idProd);
    
            if (getProduct === 'Not found') {
                return `Product with ID ${idProd} doesn't exist`;
            }
    
            const existingProduct = getCart.products.find((item) => item.product === idProd);
    
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                getCart.products.push({
                    product: idProd,
                    quantity: 1,
                });
            }
    
            getFullCart[index] = getCart;
    
            await promises.writeFile(this.path, JSON.stringify(getFullCart), 'utf-8');
    
            return `'Product added to cart'`;
        } catch (error) {
            throw error;
        }
    }
    
    
    

}

export const cartManagerInfo = new cartManager()