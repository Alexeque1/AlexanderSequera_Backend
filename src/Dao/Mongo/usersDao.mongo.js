import { usersModel } from '../../Models/users.models.js'

class usersDao {

    async getUserInfo() {
        try {
          const response = await usersModel.find()
          return response
        } catch (error) {
          logger.error("Hubo un error en DAO")
          throw new Error(error.message);
        }
      }

    async findUserById(id) {
        try {
            const response = await usersModel.findById(id)
            return response
        } catch (error) {
            logger.error("Hubo un error en DAO")
            throw new Error(error.message);
        }
    }

    async findByEmail(email) {
        try {
            const response = await usersModel.findOne({ email })
            return response
        } catch (error) {
            logger.error("Hubo un error en DAO")
            throw new Error(error.message);
        }
    }

    async createOne(obj) {
        try {
            const response = await usersModel.create(obj);
            return response
        } catch (error) {
            logger.error("Hubo un error en DAO")
            throw new Error(error.message);
        }
    }

    async deleteUser(idUser) {
        try {
            const result = await usersModel.deleteOne({ _id: idUser });
          return result;
        } catch (error) {
            logger.error("Hubo un error en DAO")
            throw new Error(error.message);
        }
    }

    async inactiveUsers() {
        try {
            const twoDaysAgo = new Date();
            twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
    
            const result = await usersModel.find({ last_conection: { $lt: twoDaysAgo } });
            await usersModel.deleteMany({ last_conection: { $lt: twoDaysAgo } });
    
            return result;
        } catch (error) {
            logger.error("Hubo un error en DAO:", error);
            throw new Error("Error al buscar y eliminar usuarios inactivos.");
        }
    }

}

export const userDao = new usersDao();