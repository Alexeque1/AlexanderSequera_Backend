import { chatDao } from "../Dao/Mongo/chatDao.mongo.js";

class ChatController {
  async getProducts() {
    try {
      const response = await chatDao.getProducts();
      return response;
    } catch (error) {
      throw new Error(`Error en el controlador al obtener mensajes: ${error.message}`);
    }
  }

  async addMessage(message) {
    try {
      const response = await chatDao.addMessage(message);
      return response;
    } catch (error) {
      throw new Error(`Error en el controlador al agregar un mensaje: ${error.message}`);
    }
  }
}

export const chatController = new ChatController();