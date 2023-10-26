import { existsSync, promises } from 'fs'
import { productsModel } from './Models/products.models.js'

class ProductManager {
    constructor() {
        this.path = 'Products.JSON'
    }

    async getProducts() {
        const response = await productsModel.find().lean()
        return response
    }

    async getProductsByQuant(number) {
        try {
            const productsAr = await this.getProducts(); 
            const products = [];
    
            if (number <= productsAr.length) {
                for (let i = 0; i < number; i++) {
                    const find = productsAr[i];
                    products.push(find);
                }
            } else {
                console.log('The limit exceeds the number of products.');
                return 'The limit exceeds the number of products.';
            }
    
            if (products.length === 0) {
                console.log('Not data.');
                return 'Not data.';
            } else {
                console.log(products);
                return products;
            }
    
        } catch (error) {
            throw new Error(error.message)
        }
    }
    

    async getProductsById(idProducto) {
        try {
            const productsAr = await this.getProducts()
            const producto = productsAr.find(prod => prod.id === idProducto)
    
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

    async getProductsByCode(code) {
        try {
            const productsAr = await this.getProducts()
            const producto = productsAr.find(prod => prod.code === code)
    
            if (!producto) {
                return ('Producto no encontrado');
            }

            console.log(producto)
            return producto
        } catch (error) {
            throw new Error(error.message)
        }
    }

    async validProductsAdd(prods) {
        const productsAr = await this.getProducts()

        const {title, description, price, code, stock, status, category} = prods

        const producto = productsAr.find(prod => prod.code === code)

        try {
            if (!title || !description || !price || !code || !stock || !status || !category) {
                return false
            } else {
                if (producto) {
                    return 'same'
                }
                return true
            }
        } catch (error) {
            return error
        }
    }

    async addProducts(product) {
        try {
            const validation = await this.validProductsAdd(product)

            if (!validation) {
                console.log({message: 'Some data is missing, please try again', product})
                return 'Some data is missing, please try again'
            } else if (validation === 'same') {
                return 'El codigo que usted ingresó ya está en sistema'
            }

            const response = await productsModel.create(product);
            return response

        } catch (error) {
            throw new Error(error.message)
        }
    }

    async removeProduct(idProducto) {
        try {
          const result = await productsModel.deleteOne({ _id: idProducto });
          return result;
        } catch (error) {
          console.error('Error al eliminar el producto:', error);
          throw new Error(error.message);
        }
      }

      async updateProduct(idProd, dataUpdate) {
        try {
          const resultado = await productsModel.updateOne(
            { _id: idProd },
            { $set: dataUpdate }
          );

          return resultado
        } catch (error) {
          console.error('Error al actualizar el producto:', error);
          throw new Error(error.message);
        }
      }
}

export const manager = new ProductManager();

