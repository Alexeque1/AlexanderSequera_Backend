import { usersModel } from '../../Models/users.models.js'

class usersDao {

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

}

export const userDao = new usersDao();