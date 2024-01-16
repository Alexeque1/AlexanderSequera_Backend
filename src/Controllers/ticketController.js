import { ticketDao } from "../Dao/Mongo/ticketsDao.mongo.js";

class ticketController {

    async createTicket(obj) {
        try {
            const newTicket = await ticketDao.createTicket(obj);
            return newTicket;
            
          } catch (error) {
            logger.error(`Error en ProductsController (createTicket): ${error.message}`);
            throw new Error(error.message);
          }
    }

}

export const ticketsController = new ticketController();