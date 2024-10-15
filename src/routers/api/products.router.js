import { Router } from 'express'
import passport from 'passport'
import ProductsController from '../../controllers/product.controller.js'
import { authRolesMiddleware } from '../../middlewares/roleMiddleware.js'
import { faker } from '@faker-js/faker';
import { logger } from '../../utils.js';



const router = Router()

// router.get('/products', passport.authenticate('current', { session: false }), ProductsController.getProducts
// )


//?PRUEBA POSTMAN
router.put('/products/:uid', ProductsController.updateProduct)



router.get('/products', ProductsController.getProducts
)

router.get('/products/:sid', ProductsController.getProductById)



router.post('/products', passport.authenticate('current', { session: false, failureRedirect: '/login' }), authRolesMiddleware('admin'), ProductsController.createProduct)


// router.put('/products/:uid', passport.authenticate('current', { session: false, failureRedirect: '/login' }), authRolesMiddleware('admin'), ProductsController.updateProduct)

router.post('/product/:uid', passport.authenticate('current', { session: false, failureRedirect: '/login' }), authRolesMiddleware('admin'), ProductsController.deleteProduct)

router.get('/mockingproducts', (req, res) => {
  try {
    const productos = [];

    for (let i = 0; i < 100; i++) {
      const producto = {
        id: faker.datatype.uuid(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.datatype.number(),
        price: faker.datatype.float({ min: 10, max: 1000, precision: 0.01 }),
        status: 'available',
        stock: faker.datatype.number({ min: 1, max: 100 }),
        category: faker.commerce.department(),
        thumbnail: faker.image.imageUrl(),
      };

      productos.push(producto)
    }

    res.json(productos)
  } catch (error) {

    logger.error(`Error al generar los productos Faker`)
    res.status(500).send('Error al generar productos ficticios')
  }
})


export default router