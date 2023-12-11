import { userDao } from "../Dao/usersDao.js";

class UserController {
  async findUserById(id) {
    try {
      const response = await userDao.findUserById(id);
      return response;
    } catch (error) {
      throw new Error(`Error en el controlador al buscar usuario por ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const response = await userDao.findByEmail(email);
      return response;
    } catch (error) {
      throw new Error(`Error en el controlador al buscar usuario por email: ${error.message}`);
    }
  }

  async createOne(obj) {
    try {
      const response = await userDao.createOne(obj);
      return response;
    } catch (error) {
      throw new Error(`Error en el controlador al crear un usuario: ${error.message}`);
    }
  }
}

export const userController = new UserController();