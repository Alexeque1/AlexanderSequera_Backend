import { ticketDao } from "../Dao/Mongo/ticketsDao.mongo.js";

class ticketController {

    async createTicket(obj) {
        try {
            const newTicket = await ticketDao.create(obj);
            return newTicket;
            
          } catch (error) {
            throw new Error(error.message);
          }
    }

}

export const ticketsController = new ticketController();