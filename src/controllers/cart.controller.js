import { cartService } from "../services/CartServices.js";
import { logger } from "../utils.js";
import userMongoDAO from "../dao/userMongoDAO.js"



export default class CartsController {



    static createCart = async (req, res) => {

        try {
            const newCart = {
                products: []
            }

            const response = await cartService.create(newCart)

            res.status(201).json(response)



        } catch (error) {
            logger.error(`error al crear el carrito ${error}`)

            res.status(500).json({ error: 'Error interno del servidor' })
        }


    }

    static getCartById = async (req, res) => {

        try {
            const idcart = req.params.cid

            if (idcart) {


                const showCart = await cartService.findCart(idcart)

                if (!showCart) {
                    throw new Error('Producto no encontrado.');
                }


                res.status(201).json(showCart)

            } else {
                res.send({ error: 'No se proporcionó un PID válido' })
            }

        } catch (error) {
            logger.error(`${error}`)
            res.status(500).json({ error: 'Error interno del servidor' })
        }

    }

    static addProduct = async (req, res) => {

        try {
            const userId = req.user.id
            const productoId = req.params.pid
            const quantity = req.params.q

            console.log('userid, productid: ', userId, productoId, req.user.cart, 'quantity: ', quantity, typeof (quantity))


            if (userId && productoId && quantity) {

                // const data = await userMongoDAO.populateUser(userId)

                // console.log('DATA ES: ', data)

                const productoEncontrado = await cartService.addProduct(req.user.cart, productoId, quantity)


                res.status(200).json(productoEncontrado)


            }

            // logger.debug(`carritoId y productoId son: ${carritoId} , ${productoId}`)

            // console.log('productoEncontrado fue: ', JSON.stringify(productoEncontrado, null, 2) )




        } catch (error) {
            logger.error(`${error}`)
            res.status(500).json({ error: 'Error interno del servidor' })
        }
    }

    static addOrderProduct = async (req, res) => {
        try {

            
            const productoId = req.params.pid
            const quantity = req.params.q


            if (productoId && quantity) {


                const productoEncontrado = await cartService.addOrderToCart(req.user.cart, productoId, quantity)
          
                res.status(200).json(productoEncontrado)


            }


        } catch (error) {

        }
    }

    static deleteProduct = async (req, res) => {

        try {

            const userId = req.user.id
            const productoId = req.params.pid

            if (userId && productoId) {

                const data = await userMongoDAO.populateUser(userId)



                logger.debug(` y productoId es: , ${productoId}`)

                const deleteProduct = await cartService.deleteItemToCart(data.cart._id, productoId)



                res.status(200).json(deleteProduct)

            }






        } catch (error) {

            logger.error(`${error}`)
            res.status(500).json({ error: 'Error interno del servidor' })
        }
    }

    static purchase = async (req, res) => {
        try {
            const cartId = req.params.cid;


            const { email } = req.user

            logger.debug(`Email es: ${email}`)


            const compra = await cartService.ticket(cartId, email)


            res.json({ message: 'Purchase successful', compra });
        } catch (err) {
            logger.error(`${err}`)

            res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    static userCart = async (req, res) => {

        try {

            const userId = req.user.id

       

            if (userId) {

                const data = await userMongoDAO.populateUser(userId)

                
                res.json(data.cart)

            }


        } catch (err) {
            logger.error(`${err}`)

            res.status(500).json({ error: 'Internal Server Error' });
        }

    }

}