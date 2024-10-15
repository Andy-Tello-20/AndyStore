import ProductsMongoDAO from "../dao/productsMongoDAO.js";
import CartMongoDAO from "../dao/cartMongoDAO.js";
import { logger } from "../utils.js";

export default class HomeController {
    static getIndex = async (req, res) => {
        try {
            logger.debug(`req.user : ,${JSON.stringify(req.user, null, 2)}`)
            if (!req.user) {
                return res.redirect('/login')
            }

            const products = await ProductsMongoDAO.get()

 
            res.status(200).render('profile', { title: 'products', user: req.user, cartId: req.user.cart, listProducts: products.map(p => p.toJSON()) })

        } catch (error) {
            logger.error(`Error al obtener los productos: ${error}`)
            res.status(500).render('error', { error: 'Error al obtener los productos' });
        }
    }

    static userCart = async (req, res) =>{
        try {

            if (!req.user) {
                return res.redirect('/login')
            }

            const cart = await CartMongoDAO.getCartById(req.user.cart)

            console.log('cart tipo recibido: ', typeof(cart), cart)
          

            //? JSON.stringify para ver en consola 

            const cartToJson = JSON.stringify(cart.products, null, 2)
            // console.log('userCart es: ', cartToJson);

         

            //? JSON.parse para convertir en un array JSON

            const products = JSON.parse(cartToJson).map(item => item.product )

            res.status(200).render('cart', { title: 'Tu carrito', cartList: products, cartId: req.user.cart});
            
        } catch (error) {
            logger.error(`Error al obtener el carrito: ${error}`)
            res.status(500).render('error', { error: 'Error al obtener el carrito' });
        }
    }
}