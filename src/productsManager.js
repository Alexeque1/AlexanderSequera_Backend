import { existsSync, promises } from 'fs'

class ProductManager {
    constructor() {
        this.path = 'Products.JSON'
    }

    async getProducts() {
        try {
            if (existsSync(this.path)) {
                const products = await promises.readFile(this.path, 'utf-8')
                console.log(products)
                return JSON.parse(products)
            } else {
                return []
            }
        } catch (error) {
            throw new Error(error.message)
        }
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
                throw new Error('Producto no encontrado');
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

            const productAr = await this.getProducts()
                let id

                if (!productAr.length) {
                    id = 1
                } else {
                    id = productAr[productAr.length - 1].id + 1
                }

                const newProduct = { id, ...product }
                productAr.push(newProduct)

                await promises.writeFile(this.path, JSON.stringify(productAr), 'utf-8')
                console.log('Product added');
                return 'Product added'

        } catch (error) {
            throw new Error(error.message)
        }
    }

    async removeProduct(idProducto) {
        const products = await this.getProducts()
        const nuevoArray =  products.filter(prod => prod.id !== idProducto)

        await promises.writeFile(this.path, JSON.stringify(nuevoArray),'utf-8')
        console.log('Product removed')
        return 'Product removed'
    }

    async updateProduct(idProducto, dataUpdate) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(prod => prod.id === idProducto);
    
            if (index === -1) {
                console.log('Product not found')
                return 'Product not found'
            } else {
                const update = {...products[index], ...dataUpdate}
                products.splice(index, 1, update)
                await promises.writeFile(this.path, JSON.stringify(products), 'utf-8');
                console.log('Updated')
                return 'Updated'
            }

        } catch (error) {
            throw error;
        }
    }
}

export const manager = new ProductManager();

