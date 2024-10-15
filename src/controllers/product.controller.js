// controllers/productsController.js
// import { error } from 'winston';
import ProductsMongoDAO from '../dao/productsMongoDAO.js';
import { errorDictionary } from '../utils.js';
import { logger } from '../utils.js';


//! productController REFACTORIZADO

export default class ProductsController {
  static async getProducts(req, res) {
    try {
      const products = await ProductsMongoDAO.get();

      if (!products) {

        throw new Error(errorDictionary.PRODUCT_NOT_FOUND);
      }
      res.status(200).json(products);


    } catch (error) {
      logger.error(`Error al obtener los productos de la lista:, ${error}`)
      // console.error('Error al obtener los productos de la lista:', error);
      if (error.message === errorDictionary.PRODUCT_NOT_FOUND) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al obtener los productos' });
      }
    }
  }

  static async createProduct(req, res) {
    try {
      const { body } = req;
      const product = await ProductsMongoDAO.create(body);
      res.status(201).json(product);
    } catch (error) {
      logger.error(`Error al crear el producto: ${error}`)
      res.status(500).json({ error: errorDictionary.PRODUCT_CREATION_ERROR });
    }
  }

  static async getProductById(req, res) {
    try {
      const { sid } = req.params;
      const product = await ProductsMongoDAO.getById(sid);

      if (!product) {
        throw new Error(errorDictionary.PRODUCT_NOT_FOUND);
      }
      res.status(200).json(product);
    } catch (error) {
      logger.error(`Error al obtener los producto: ${error}`)
      if (error.message === errorDictionary.PRODUCT_NOT_FOUND) {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Error al intentar obtener un producto' });
      }
    }
  }

  static async updateProduct(req, res) {
    try {
      const { uid } = req.params;
      const { body } = req;

      console.log('uid es: ', uid, 'body es: ', body)

      const updatedProduct = await ProductsMongoDAO.updateById(uid, body);

      if (!updatedProduct) {
        throw new Error(errorDictionary.PRODUCT_UPDATE_ERROR);
      }

      res.status(204).end();
    } catch (error) {
      logger.error(`Error al actualizar el producto: ${error}`)
      res.status(500).json({ error: errorDictionary.PRODUCT_UPDATE_ERROR });
    }
  }

  static async deleteProduct(req, res) {
    try {
      const { uid } = req.params;
      const deletedProduct = await ProductsMongoDAO.deleteById(uid);

      if (!deletedProduct) {
        throw new Error(errorDictionary.PRODUCT_DELETION_ERROR);
      }

      res.status(204).end();
    } catch (error) {
      logger.error(`Error al eliminar el producto: ${error}`)
      res.status(500).json({ error: errorDictionary.PRODUCT_DELETION_ERROR });
    }
  }

  
}

