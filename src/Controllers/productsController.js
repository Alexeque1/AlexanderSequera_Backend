import { productDao } from "../Dao/Mongo/productsDao.mongo.js";
import { logger } from "../Fuctions/logger.js";

class ProductsController {
  async getProducts(obj) {
    try {
      const response = await productDao.getProducts(obj);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (getProducts): ${error.message}`);
      throw new Error(`Error en el controlador al obtener productos: ${error.message}`);
    }
  }

  async getProductsByQuant(number) {
    try {
      const response = await productDao.getProductsByQuant(number);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (getProductsByQuant): ${error.message}`);
      throw new Error(`Error en el controlador al obtener productos por cantidad: ${error.message}`);
    }
  }

  async getProductsById(idProducto) {
    try {
      const response = await productDao.getProductsById(idProducto);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (getProductsById): ${error.message}`);
      throw new Error(`Error en el controlador al obtener productos por ID: ${idProducto}. Error: ${error.message}`);
    }
  }

  async getProductsByCode(code) {
    try {
      const response = await productDao.getProductsByCode(code);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (getProductsByCode): ${error.message}`);
      throw new Error(`Error en el controlador al obtener productos por código: ${error.message}`);
    }
  }

  async validProductsAdd(prods) {
    try {
      const response = await productDao.validProductsAdd(prods);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (validProductsAdd): ${error.message}`);
      throw new Error(`Error en el controlador al validar productos antes de agregar: ${error.message}`);
    }
  }

  async addProducts(product, user) {
    try {
      const response = await productDao.addProducts(product, user);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (addProducts): ${error.message}`);
      throw new Error(`Error en el controlador al agregar productos: ${error.message}`);
    }
  }

  async removeProduct(idProducto) {
    try {
      const response = await productDao.removeProduct(idProducto);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (removeProduct): ${error.message}`);
      throw new Error(`Error en el controlador al eliminar un producto: ${error.message}`);
    }
  }

  async updateProduct(idProd, dataUpdate) {
    try {
      const response = await productDao.updateProduct(idProd, dataUpdate);
      return response;
    } catch (error) {
      logger.error(`Error en ProductsController (updateProduct): ${error.message}`);
      throw new Error(`Error en el controlador al actualizar un producto: ${error.message}`);
    }
  }
}

export const productsController = new ProductsController();
