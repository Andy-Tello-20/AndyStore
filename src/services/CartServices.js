// import DAO from "../dao/cartMongoDAO.js";
// import DAO from "../dao/cartFsDAO.js";


import { DAO } from "../dao/factory.js";
import TicketMongoDAO from "../dao/ticketDAO.js";



class CartService {
    constructor(dao) {
        this.dao = dao; // Instancia el DAO MongoDB o FsDAO
    }

    async create(newCart) {
        const crear = await this.dao.createCart(newCart);


        return crear

    }

    async findCart(id) {

        const Cart = await this.dao.getCartById(id)

        return Cart

    }

    async addProduct(idCart, idProducto, quantity) {
        const productoEncontrado = await this.dao.addProductToCart(idCart, idProducto, quantity)


        if (productoEncontrado) {

            return productoEncontrado

        } else {

            const mensaje = "no se encontro ningun producto 😪"

            return mensaje
        }
    }



    async addOrderToCart(idCart, idProducto, quantity) {
        const productoEncontrado = await this.dao.addOrder(idCart, idProducto, quantity)


        if (productoEncontrado) {

            return productoEncontrado

        } else {

            const mensaje = "no se encontro ningun producto 😪"

            return mensaje
        }

    }




    async deleteItemToCart(cid, pid) {
        const product = await this.dao.removeProductFromCart(cid, pid)

        return product
    }

    async ticket(id, email) {
        const retornoTicket = await TicketMongoDAO.createTicket(id, email)

        return retornoTicket


    }
}

export const cartService = new CartService(DAO);

