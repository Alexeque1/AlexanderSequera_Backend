
export default class chatsRepository {
    constructor(dao) {
        this.dao = dao;
    }

    getProducts = async () => {
        let result = await this.dao.getProducts()
        return result
    }

    addMessage = async (message) => {
        let result = await this.dao.addMessage(message)
        return result
    }

}