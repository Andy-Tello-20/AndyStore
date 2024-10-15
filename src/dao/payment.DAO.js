import CartModel from "./models/cart.model.js";
import ProductsModel from "./models/products.model.js";
import TicketModel from "./models/ticket.model.js";

export default class paymentDao {

    static updateCart = async (cid,email) => {
        try {
            const cart = await CartModel.findById(cid).populate('products.product');
            console.log('se encontro el carrito paymentDAO: ',cart)

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

             //! actualizar carrito con productos sin stock existente suficiente
             cart.products = cart.products.filter(item => failedProducts.includes(item.product._id));
             await cart.save();
 
             return ticket
         } catch (err) {
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