import { cartService } from "../services/CartServices.js"
import { MercadoPagoConfig, Preference } from 'mercadopago'
import config from "../config/config.js"



const mpTOKEN= config.mpToken

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: mpTOKEN })

export default class mpController {
    static findCart = async (req, res) => {
        try {
            const userId = req.user

            if (userId) {
                const getCart = await cartService.findCart(userId.cart)

                if (getCart) {
                    console.log('getCart es: ', getCart.products)

                  
                    let items = getCart.products.map(i => ({
                        title: i.product.title,
                        unit_price: i.product.price,
                        quantity: i.quantity
                    }));

                    console.log('array es: ', items)

                
                    const preference = new Preference(client)
                    const preferenceResponse = await preference.create({
                        body: {
                            items,
                            back_urls: {
                                success: "http://localhost:8080/api/payment-success",
                                failure: "http://localhost:3000/",
                                pending: "http://localhost:3000/"
                            },
                            auto_return: "approved" 
                        }
                    });

                    console.log('Preferencia creada:', preferenceResponse.id)
                    res.status(200).json(preferenceResponse.id)
                } else {
                    res.status(404).json({ message: "Carrito no encontrado" })
                }
            } else {
                res.status(401).json({ message: "Usuario no autenticado" })
            }
        } catch (error) {
            console.error('Error al encontrar el carrito:', error);
            res.status(500).json({ message: "Error interno del servidor" })
        }
    }
}
