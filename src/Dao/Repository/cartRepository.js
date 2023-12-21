
export default class cartsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getCartInfo = async () => {
        let result = await this.dao.getCartInfo()
        return result
    }

    getCartById = async (idCart) => {
        let result = await this.dao.getCartById(idCart)
        return result
    }

    createCart = async () => {
        let result = await this.dao.createCart(idCart)
        return result
    }

    updateProduct = async (idCart, productId, quantity) => {
        let result = await this.dao.updateProduct(idCart, productId, quantity)
        return result
    }

    deleteProduct = async (idCart, productId) => {
        let result = await this.dao.deleteProduct(idCart, productId)
        return result
    }

    deleteCart = async (idCart) => {
        let result = await this.dao.deleteCart(idCart)
        return result
    }

    updateQuantity = async (idCart, productId, quantityAct) => {
        let result = await this.dao.updateQuantity(idCart, productId, quantityAct)
        return result
    }
}