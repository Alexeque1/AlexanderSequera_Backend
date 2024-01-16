import { ticketsModel } from "../../Models/tickets.models.js";

class ticketsDao {

    async createTicket(obj) {
        try {
            const newTicket = await ticketsModel.create(obj);
            return newTicket;

          } catch (error) {
            logger.error("Hubo un error en DAO")
            throw new Error(error.message);
          }
    }

}

export const ticketDao = new ticketsDao()