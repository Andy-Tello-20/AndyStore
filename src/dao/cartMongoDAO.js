import CartModel from './models/cart.model.js'
import ProductModel from './models/products.model.js';
import { logger } from '../utils.js';

export default class CartMongoDAO {

    static async createCart(data) {
        const product = await CartModel.create(data);

        logger.debug(`Carrito creado correctamente (${product._id}) `)


        return product;
    }


    static async getCart() {
        try {
            const cart = await CartModel.find({});
            return cart;
        } catch (error) {
            logger.error(`Error al obtener el carrito:, ${error}`)
            throw error;
        }
    }


    static async getCartById(sid) {
        return await CartModel.findById(sid).populate('products.product');
    }



    static async addProductToCart(idCart, idProducto, quantityParam) {
        try {
            // Buscar el carrito y popular los productos
            let carritoEncontrado = await CartModel.findById(idCart).populate('products.product');
            let findProduct = await ProductModel.findById(idProducto)

            console.log('findProduct es: ', findProduct)


            if (!carritoEncontrado) {
                throw new Error('Carrito no encontrado');
            }

            //si existe el carrito, Verificar si el producto ya existe en el carrito
            const existingProductIndex = carritoEncontrado.products.findIndex(i => {
                // Comparar correctamente el _id del producto, independientemente de si está poblado o no
                return (i.product._id ? i.product._id.toString() : i.product.toString()) === idProducto.toString();
            });

            if (existingProductIndex !== -1) {

                let qparam = parseInt(quantityParam)


                carritoEncontrado.products[existingProductIndex].quantity = qparam


                // Si el producto ya está en el carrito, aumentar la cantidad en una unidad
                // console.log('el producto con cantidad fue: ',carritoEncontrado.products[existingProductIndex])
                // carritoEncontrado.products[existingProductIndex].quantity++;

            } else {
                // Si el producto no está en el carrito, agregarlo como nuevo
                carritoEncontrado.products.push({
                    product: idProducto,
                    quantity: quantityParam,
                    lastPrice: findProduct.price
                });
            }

            // Guardar el carrito actualizado
            await carritoEncontrado.save();

            // Repoblar para devolver el carrito actualizado con productos completos
            carritoEncontrado = await CartModel.findById(idCart).populate('products.product');


            return carritoEncontrado;
        } catch (error) {
            logger.error(`Error al agregar producto al carrito:, ${error}`)
            throw error;
        }
    }



    static async addOrder(idCart, idProducto, quantityParam) {
        try {


            const findCart = await CartModel.findById(idCart)

            if (findCart) {


                let findProduct = findCart.products.find(i => i.product.toString() == idProducto)

                console.log()

                if (findProduct) {

                    findProduct.quantity = findProduct.quantity + parseInt(quantityParam)

                } else {

                   let findProduct = await ProductModel.findById(idProducto)

                    findCart.products.push({
                        product: idProducto,
                        quantity: quantityParam,
                        lastPrice: findProduct.price
                    })
                }

                await findCart.save()


                return findCart
            }


        } catch (error) {
            logger.error(`Error al agregar producto al carrito:, ${error}`)
            throw error;
        }
    }



    static async updateCartById(sid, data) {
        await CartModel.updateOne({ _id: sid }, { $set: data });
        logger.debug(`Producto actualizado correctamente ${sid} `)
    }


    static async removeProductFromCart(cartId, productId) {
        try {
            const result = await CartModel.updateOne(
                { _id: cartId },
                { $pull: { products: { product: productId } } }
            );


            console.log('result es: ', result)

        } catch (error) {
            console.error('Error al eliminar el producto del carrito:', error);
        }
    }

    static async deleteCartById(sid) {
        await CartModel.deleteOne({ _id: sid });
        logger.debug(`Carrito eliminado correctamente (${sid}) `)
    }

}

