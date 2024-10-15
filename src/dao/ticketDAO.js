import TicketModel from "./models/ticket.model.js";
import CartModel from "./models/cart.model.js";
import ProductsModel from "./models/products.model.js";
import { logger } from "../utils.js";

export default class TicketMongoDAO {

    static async createTicket(cartId, email) {
        try {
            const cart = await CartModel.findById(cartId).populate('products.product');


            if (!cart) {
                throw new Error('Cart not found');
            }

            //? aca se guardan los _Ids de los productos que no contaban con suficiente stock
            let failedProducts = [];

            for (const item of cart.products) {
                const product = item.product;
                const quantityInCart = item.quantity;
                const availableStock = product.stock;

                if (quantityInCart <= availableStock) {
                    product.stock -= quantityInCart;

                    //? Actualiza el stock del producto en la base de datos (lo ideal seria que se actualice cuando se confirme la compra)
                    await ProductsModel.findByIdAndUpdate(product._id, { stock: product.stock });
                } else {
                    failedProducts.push(product._id);


                }
            }


            //! crea un array con los productos con stock

            let withStock = cart.products.filter(item => !failedProducts.includes(item.product._id))

            console.log('withStock es: ', withStock)


            // if (failedProducts.length > 0) {


            //     //! Filtra los productos que no pudieron comprarse y actualiza el carrito con los productos con insuficiente stock
            //     cart.products = cart.products.filter(item => failedProducts.includes(item.product._id));
            //     await cart.save();

            //     // logger.debug(`cart.products (carrito pendiente de stock) es: ${cart.products}`)

            //     // logger.debug(`failedProducts ( productos con insuficiente stock )es: ${failedProducts}`)


            //     //? Devuelve los IDs de los productos que no pudieron procesarse
            //     return { withStock };
            // }


            const productsToStore = withStock.map(item => ({
                product: item.product._id,
                title: item.product.title,
                price: item.product.price,
                quantity: item.quantity
            }));


            const ticket = await TicketModel.create({
                amount: calcularTotalCompra(withStock),
                purchaser: email,
                products: productsToStore  // Agrega los productos transformados al ticket
            });

            // const ticket = await TicketModel.create({
            //     amount: calcularTotalCompra(withStock),
            //     purchaser: email
            // })

            logger.debug(`ticket es: ${ticket}`)




            //! actualizar carrito con productos sin stock existente suficiente
            cart.products = cart.products.filter(item => failedProducts.includes(item.product._id));
            await cart.save();

            return ticket
        } catch (err) {
            logger.error(`${err}`)
            throw err;
        }
    }

    static async getTicket(email) {

        try {
            
            const ticket= await TicketModel.findOne({ purchaser: email }).sort({ createdAt: -1 }).exec()

            console.log ('ticketDao es: ', ticket)

            return ticket

        } catch (error) {
            logger.error(`${err}`)
            throw err;
        }
    }

}

function calcularTotalCompra(products) {
    let total = 0;

    for (const item of products) {
        const product = item.product;
        const quantityInCart = item.quantity;


        const subtotal = product.price * quantityInCart;
        total += subtotal;

    }

    return total;
}