import { messagesModel } from '../../Models/messages.models.js'

class chatsDao {

    async getProducts() {
        try {
            const response = await messagesModel.find().lean()
            return response
        } catch (error) {
            logger.error("Hubo un error en DAO")
            throw new Error(error.message);
        }
    }

    async addMessage(message) {
        try {

            const response = await messagesModel.create(message);
            return response

        } catch (error) {
            logger.error("Hubo un error en DAO")
            throw new Error(error.message);
        }
    }

}

export const chatDao = new chatsDao()