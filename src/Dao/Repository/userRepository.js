
export default class usersRepository {
    constructor(dao) {
        this.dao = dao;
    }

    findUserById = async (userId) => {
        let result = await this.dao.findUserById(userId)
        return result
    }

    findByEmail = async (userEmail) => {
        let result = await this.dao.findByEmail(userEmail)
        return result
    }

    createOne = async (obj) => {
        let result = await this.dao.createOne(obj)
        return result
    }

}