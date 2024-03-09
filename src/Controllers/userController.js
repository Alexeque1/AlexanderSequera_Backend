import { userDao } from "../Dao/Mongo/usersDao.mongo.js";

class UserController {
  async getUserInfo() {
    try {
      const response = await userDao.getUserInfo();
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (findUserById): ${error.message}`);
      throw new Error(`Error en el controlador al buscar usuario por ID: ${error.message}`);
    }
  }

  async findUserById(id) {
    try {
      const response = await userDao.findUserById(id);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (findUserById): ${error.message}`);
      throw new Error(`Error en el controlador al buscar usuario por ID: ${error.message}`);
    }
  }

  async findByEmail(email) {
    try {
      const response = await userDao.findByEmail(email);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (findByEmail): ${error.message}`);
      throw new Error(`Error en el controlador al buscar usuario por email: ${error.message}`);
    }
  }

  async createOne(obj) {
    try {
      const response = await userDao.createOne(obj);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (createOne): ${error.message}`);
      throw new Error(`Error en el controlador al crear un usuario: ${error.message}`);
    }
  }

  async removeUser(id) {
    try {
      const response = await userDao.deleteUser(id);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (createOne): ${error.message}`);
      throw new Error(`Error en el controlador al crear un usuario: ${error.message}`);
    }
  }

  async inactiveUsers() {
    try {
      const response = await userDao.inactiveUsers();
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (createOne): ${error.message}`);
      throw new Error(`Error en el controlador al crear un usuario: ${error.message}`);
    }
  }
}

export const userController = new UserController();