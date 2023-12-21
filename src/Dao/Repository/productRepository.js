export default class productsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async (obj) => {
        let result = await this.dao.getProducts(obj)
        return result
    }

    getProductsByQuant = async (quantity) => {
        let result = await this.dao.getProductsByQuant(quantity)
        return result
    }

    getProductsById = async (idProducto) => {
        let result = await this.dao.getProductsById(idProducto)
        return result
    }

    getProductsByCode = async (code) => {
        let result = await this.dao.getProductsByCode(code)
        return result
    }

    validProductsAdd = async (prods) => {
        let result = await this.dao.validProductsAdd(prods)
        return result
    }

    addProducts = async (product) => {
        let result = await this.dao.addProducts(product)
        return result
    }

    removeProduct = async (idProducto) => {
        let result = await this.dao.removeProduct(idProducto)
        return result
    }

    updateProduct = async (idProducto, dataUpdate) => {
        let result = await this.dao.updateProduct(idProducto, dataUpdate)
        return result
    }

}