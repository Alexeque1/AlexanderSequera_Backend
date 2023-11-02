import { existsSync, promises } from 'fs'
import { messagesModel } from './Models/messages.models.js'

class chatManager {

    async getProducts() {
        const response = await messagesModel.find().lean()
        return response
    }

    async addMessage(message) {
        try {

            const response = await messagesModel.create(message);
            return response

        } catch (error) {
            throw new Error(error.message)
        }
    }

}

export const chatManagerInfo = new chatManager()