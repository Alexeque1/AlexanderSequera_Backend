import { usersModel } from '../Models/users.models.js'

class usersDao {

    async findUserById(id) {
        const response = await usersModel.findById(id)
        return response
    }

    async findByEmail(email) {
        const response = await usersModel.findOne({ email })
        return response
    }

    async createOne(obj) {
        const response = await usersModel.create(obj);
        return response
    }

}

export const userDao = new usersDao();